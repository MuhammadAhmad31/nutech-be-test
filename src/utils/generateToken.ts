import jwt from "jsonwebtoken";
import { decodeToken } from "../types/decodeToken";

export const generateToken = (payload: decodeToken): string => {
  const secret = process.env.JWT_SECRET || "secretKey";
  const expiresIn = 60 * 60 * 12;

  const token = jwt.sign(payload, secret, { expiresIn: expiresIn });
  return token;
};
