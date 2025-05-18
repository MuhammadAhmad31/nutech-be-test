import dbPool from "../../config/database";
import { queryGet, queryGetOne } from "../helper/queryHelper";

export const createTransaction = async ({
  email,
  service_code
}: {
  email: string;
  service_code: string;
}) => {
  const client = await dbPool.connect();
  try {
    await client.query("BEGIN");

    const userRes = await client.query(
      `SELECT id FROM "user" WHERE email = $1 FOR UPDATE`,
      [email]
    );
    if (userRes.rowCount === 0) {
      throw new Error("USER_NOT_FOUND");
    }
    const userId = userRes.rows[0].id;

    const serviceRes = await client.query(
      `SELECT id, service_name, service_tariff FROM service WHERE service_code = $1`,
      [service_code]
    );

    if (serviceRes.rowCount === 0) {
      throw new Error("SERVICE_NOT_FOUND");
    }
    const { id: serviceId, service_name, service_tariff: total_amount } = serviceRes.rows[0];

    const invoiceNumber = `INV${Date.now()}`;
    const transactionType = "PAYMENT";

    const insertRes = await client.query(
      `
      INSERT INTO "transaction" (
        user_id, service_id, invoice_number, total_amount, transaction_type
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING created_at
      `,
      [userId, serviceId, invoiceNumber, total_amount, transactionType]
    );

    const created_on = insertRes.rows[0].created_at;

    await client.query("COMMIT");

    return {
      invoice_number: invoiceNumber,
      service_code,
      service_name,
      transaction_type: transactionType,
      total_amount,
      created_on
    };
  } catch (error) {
    await client.query("ROLLBACK");

    throw {
      message: (error as Error).message
    };
  } finally {
    client.release();
  }
};

export const getTransactionHistory = async ({
  email,
  offset,
  limit
}: {
  email: string;
  offset: number;
  limit: number;
}) => {
  const user = await queryGetOne<{ id: string }>(
    `SELECT id FROM "user" WHERE email = $1`,
    [email]
  );
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const records = await queryGet(
    `
    SELECT
      t.invoice_number,
      t.transaction_type,
      COALESCE(s.service_name, 'Top Up balance') AS description,
      t.total_amount,
      t.created_at AS created_on
    FROM "transaction" t
    LEFT JOIN service s ON s.id = t.service_id
    WHERE t.user_id = $1
    ORDER BY t.created_at DESC
    OFFSET $2
    LIMIT $3
    `,
    [user.id, offset, limit]
  );

  return {
    offset,
    limit,
    records
  };
};
