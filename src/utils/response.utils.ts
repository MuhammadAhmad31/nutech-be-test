import type { Response } from "express";
import { ResponseData } from "../types/response.type";

export const response_handler = <T>(
  res: Response,
  status: number,
  message: string,
  data: T
): Response<ResponseData<T>> => {
  const result: ResponseData<T> = {
    status,
    message,
    data,
  };
  return res.status(200).json(result);
};

export const response_success = <T>(
  res: Response,
  data: T,
  message = "Sukses"
): Response<ResponseData<T>> => response_handler(res, 0, message, data);

export const response_created = <T>(
  res: Response,
  data: T,
  message = "Berhasil dibuat"
): Response<ResponseData<T>> => response_handler(res, 201, message, data);

export const response_bad_request = <T = null>(
  res: Response,
  message = "Bad request"
): Response<ResponseData<T>> => response_handler(res, 102, message, null as T);

export const response_invalid_credentials = <T = null>(
  res: Response,
  message = "Invalid credentials"
): Response<ResponseData<T>> => response_handler(res, 103, message, null as T);

export const response_unauthorized = <T = null>(
  res: Response,
  message = "Unauthorized"
): Response<ResponseData<T>> => response_handler(res, 108, message, null as T);

export const response_forbidden = <T = null>(
  res: Response,
  message = "Forbidden"
): Response<ResponseData<T>> => response_handler(res, 403, message, null as T);

export const response_not_found = <T = null>(
  res: Response,
  message = "Not found"
): Response<ResponseData<T>> => response_handler(res, 404, message, null as T);

export const response_internal_server_error = <T = null>(
  res: Response,
  message = "Internal server error"
): Response<ResponseData<T>> => response_handler(res, 500, message, null as T);
