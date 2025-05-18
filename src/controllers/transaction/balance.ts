import { Request, Response } from "express";
import { ResponseData } from "../../types/response.type";
import { addBalance, getBalance } from "../../services/transaction/balance";
import {
  response_bad_request,
  response_internal_server_error,
  response_success,
} from "../../utils/response.utils";

export const get = async (
  req: Request,
  res: Response
): Promise<Response<ResponseData<{ balance: number }>>> => {
  const { email } = res.locals.userData;

  try {
    const response = await getBalance(email);

    return response_success<{ balance: number }>(
      res,
      response,
      "Get Balance Berhasil"
    );
  } catch (error: any) {
    if (error.message === "BALANCE_NOT_FOUND") {
      return response_bad_request(res, "Saldo tidak ditemukan");
    }
    return response_internal_server_error(res, "Terjadi kesalahan pada server");
  }
};

export const topup = async (
    req: Request,
    res: Response
): Promise<Response<ResponseData<{ balance: number }>>> => {
    const { email } = res.locals.userData;
    const { top_up_amount } = req.body;

    if (!top_up_amount) {
        return response_bad_request(res, "Parameter amount tidak boleh kosong");
    }

    try {
        const response = await addBalance(email, top_up_amount);

        return response_success<{ balance: number }>(
            res,
            response,
            "Top Up Balance berhasil"
        );
    } catch (error: any) {
        if (error.message === "AMOUNT_MUST_BE_POSITIVE") {
            return response_bad_request(res, "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0");
        } else if (error.message === "FAILED_TO_ADD_BALANCE") {
            return response_bad_request(res, "Gagal menambahkan saldo");
        }
        return response_internal_server_error(res, "Terjadi kesalahan pada server");
    }
    
}