import { Request, Response } from "express";
import {
  response_bad_request,
  response_internal_server_error,
  response_invalid_credentials,
  response_success
} from "../utils/response.utils";
import { RegisterRequest } from "../types/auth.type";
import { ResponseData } from "../types/response.type";
import { loginService, registerService } from "../services/auth";
import { isValidEmail, isValidPassword } from "./helper/verifyCredentials";


export const register = async (
  req: Request,
  res: Response
): Promise<Response<ResponseData<null>>> => {
  const { first_name, last_name, email, password }: RegisterRequest = req.body;

  if (!first_name || !last_name || !email || !password) {
    return response_bad_request(res, "Anda mengirimkan data yang salah");
  }

  if (!isValidEmail(email)) {
    return response_bad_request(res, "Parameter email tidak sesuai format");
  }

  if (!isValidPassword(password)) {
    return response_bad_request(res, "Password minimal harus 8 karakter");
  }

  try {
    await registerService({ first_name, last_name, email, password });
    return response_success<null>(res, null, "Registrasi berhasil silakan login");
  } catch (error: any) {
    if (error.message === "EMAIL_ALREADY_REGISTERED") {
      return response_bad_request(res, "Email sudah digunakan");
    }
    return response_internal_server_error(res, "Gagal melakukan registrasi");
  }
};


export const login = async (
  req: Request,
  res: Response
): Promise<Response<ResponseData<{ token: string }>>> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return response_bad_request(res, "Email dan password wajib diisi");
  }

  if (!isValidEmail(email)) {
    return response_bad_request(res, "Parameter email tidak sesuai format");
  }

  if (!isValidPassword(password)) {
    return response_bad_request(res, "Password minimal harus 8 karakter");
  }

  try {
    const { token } = await loginService(email, password);
    return response_success<{ token: string }>(res, { token }, "Login berhasil");
  } catch (error) {
    const errorMsg = (error as Error).message;

    if (errorMsg === "INVALID_CREDENTIALS") {
      return response_invalid_credentials(res, "Username atau password salah");
    }

    return response_internal_server_error(res, "Login gagal: " + errorMsg);
  }
};
