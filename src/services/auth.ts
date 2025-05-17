import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";
import { RegisterRequest } from "../types/auth.type";
import { queryGetOne, queryInsert } from "./helper/queryHelper";

export const registerService = async (body: RegisterRequest) => {
  const existingUser = await queryGetOne(`SELECT id FROM "user" WHERE email = $1`, [body.email]);

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_REGISTERED");
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);
  const sql = `INSERT INTO "user" (email, first_name, last_name, password) VALUES ($1, $2, $3, $4)`;
  const params = [body.email, body.first_name, body.last_name, hashedPassword];

  const insertId = await queryInsert(sql, params);
  return insertId;
};

export const loginService = async (email: string, password: string) => {
  const sqlQuery = `SELECT * FROM "user" WHERE email = $1`;
  const user = await queryGetOne(sqlQuery, [email]);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const payload = {
    email: user.email,
  };

  const token = generateToken(payload);
  return { user, token };
};
