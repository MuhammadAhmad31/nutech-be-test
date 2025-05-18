import dbPool from "../../config/database";
import { queryGetOne, queryUpdateOne } from "../helper/queryHelper";

export const getBalance = async (email: string) => {
  const sql = `
    SELECT b.balance
    FROM balance b
    JOIN "user" u ON u.id = b.user_id
    WHERE u.email = $1
  `;

  const balance = await queryGetOne(sql, [email]);

  if (!balance) {
    throw new Error("BALANCE_NOT_FOUND");
  }

  return balance;
};

export const addBalance = async (email: string, amount: number) => {
  if (amount < 0) {
    throw new Error("AMOUNT_MUST_BE_POSITIVE");
  }

  const client = await dbPool.connect();
  try {
    await client.query("BEGIN");

    const userRes = await client.query(
      `SELECT id FROM "user" WHERE email = $1`,
      [email]
    );
    if (userRes.rowCount === 0) {
      throw new Error("USER_NOT_FOUND");
    }
    const userId = userRes.rows[0].id;

    const balanceRes = await client.query(
      `
      UPDATE balance
      SET balance = balance + $1,
          updated_at = NOW()
      WHERE user_id = $2
      RETURNING balance;
      `,
      [amount, userId]
    );
    if (balanceRes.rowCount === 0) {
      throw new Error("FAILED_TO_ADD_BALANCE");
    }

    const invoiceNumber = `TOPUP-${Date.now()}`;

    await client.query(
      `
        INSERT INTO "transaction" (
            user_id, invoice_number, total_amount, transaction_type, service_id
        ) VALUES ($1, $2, $3, 'TOPUP', NULL)
        `,
      [userId, invoiceNumber, amount]
    );

    await client.query("COMMIT");
    return {
      balance: Number(balanceRes.rows[0].balance),
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const deductBalance = async (email: string, amount: number) => {
  if (amount < 0) {
    throw new Error("AMOUNT_MUST_BE_POSITIVE");
  }

  const current = await getBalance(email);
  if (parseFloat(current.balance) < amount) {
    throw new Error("INSUFFICIENT_BALANCE");
  }

  const sql = `
    UPDATE balance
    SET balance = balance - $1,
        updated_at = NOW()
    FROM "user"
    WHERE balance.user_id = "user".id
      AND "user".email = $2
    RETURNING balance;
  `;

  const result = await queryUpdateOne<{ balance: string }>(sql, [
    amount,
    email,
  ]);

  if (!result) {
    throw new Error("FAILED_TO_DEDUCT_BALANCE");
  }

  return result;
};
