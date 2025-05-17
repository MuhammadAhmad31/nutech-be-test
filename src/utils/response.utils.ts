import type { Response } from "express";
import { ResponseData } from "../types/response.type";

export const response_handler = <T>(
  res: Response,
  status: number,
  message: string,
  data: T,
  httpStatus: number = 200 
): Response<ResponseData<T>> => {
  const result: ResponseData<T> = {
    status,
    message,
    data,
  };
  return res.status(httpStatus).json(result);
};

export const response_success = <T>(
  res: Response,
  data: T,
  message = "Sukses"
) => response_handler(res, 0, message, data, 200);

export const response_created = <T>(
  res: Response,
  data: T,
  message = "Berhasil dibuat"
) => response_handler(res, 201, message, data, 201);

export const response_bad_request = <T = null>(
  res: Response,
  message = "Bad request"
) => response_handler<T>(res, 102, message, null as T, 400);

export const response_invalid_credentials = <T = null>(
  res: Response,
  message = "Invalid credentials"
) => response_handler<T>(res, 103, message, null as T, 401);

export const response_unauthorized = <T = null>(
  res: Response,
  message = "Unauthorized"
) => response_handler<T>(res, 108, message, null as T, 401);

export const response_forbidden = <T = null>(
  res: Response,
  message = "Forbidden"
) => response_handler<T>(res, 403, message, null as T, 403);

export const response_not_found = <T = null>(
  res: Response,
  message = "Not found"
) => response_handler<T>(res, 404, message, null as T, 404);

export const response_internal_server_error = <T = null>(
  res: Response,
  message = "Internal server error"
) => response_handler<T>(res, 500, message, null as T, 500);
