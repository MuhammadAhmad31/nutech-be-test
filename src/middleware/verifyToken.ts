import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { response_unauthorized } from '../utils/response.utils';

dotenv.config();

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return response_unauthorized(res, "Token tidak tidak valid atau kadaluwarsa");
  }

  const token = authorization.split(" ")[1];
  const secret = process.env.JWT_SECRET || "secretKey";;

  try {
    const jwtDecode = jwt.verify(token, secret);

    if (typeof jwtDecode !== "string") {
      res.locals.userData = jwtDecode;
    }

    next();
  } catch (error) {
    return response_unauthorized(res, "Token tidak tidak valid atau kadaluwarsa");
  }
};
