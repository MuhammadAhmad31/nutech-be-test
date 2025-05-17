import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { response_bad_request } from "../utils/response.utils";

export const multerErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError || err.message?.includes("JPEG") || err.message?.includes("PNG")) {
    return response_bad_request(res, err.message);
  }

  next(err);
};
