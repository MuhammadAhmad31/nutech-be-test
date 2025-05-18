import { Request, Response } from "express";
import { ResponseData } from "../../types/response.type";
import {
  TransactionHistoryResponse,
  TransactionResponse,
} from "../../types/transaction";
import {
  response_bad_request,
  response_internal_server_error,
  response_success,
} from "../../utils/response.utils";
import {
  createTransaction,
  getTransactionHistory,
} from "../../services/transaction/transaction";

export const create = async (
  req: Request,
  res: Response
): Promise<Response<ResponseData<TransactionResponse>>> => {
  const { email } = res.locals.userData;
  const { service_code } = req.body;

  if (!service_code) {
    return response_bad_request(
      res,
      "Parameter service_code tidak boleh kosong"
    );
  }

  try {
    const response = await createTransaction({ email, service_code });

    return response_success<TransactionResponse>(
      res,
      response,
      "Transaksi berhasil"
    );
  } catch (error: any) {
    if (error.message === "SERVICE_NOT_FOUND") {
      return response_bad_request(res, "Service ataus Layanan tidak ditemukan");
    }

    if (error.message === "USER_NOT_FOUND") {
      return response_bad_request(res, "User tidak ditemukan");
    }

    console.error("Transaction Error:", error);

    return response_internal_server_error(
      res,
      error.message || "Terjadi kesalahan pada server"
    );
  }
};

export const getHistory = async (
  req: Request,
  res: Response
): Promise<Response<ResponseData<TransactionHistoryResponse>>> => {
  const { email } = res.locals.userData;

  const offset = parseInt(req.query.offset as string) || 0;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const data = await getTransactionHistory({ email, offset, limit });

    return response_success<TransactionHistoryResponse>(
      res,
      data,
      "Berhasil mengambil data transaksi"
    );
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return response_bad_request(res, "User tidak ditemukan");
    }

    return response_internal_server_error(res, "Terjadi kesalahan pada server");
  }
};
