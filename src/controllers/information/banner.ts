import { Request, Response } from "express";
import { ResponseData } from "../../types/response.type";
import { Banner } from "../../types/banner.type";
import { getBanner } from "../../services/information/banner";
import {
  response_internal_server_error,
  response_not_found,
  response_success,
} from "../../utils/response.utils";

export const get = async (
  req: Request,
  res: Response
): Promise<Response<ResponseData<Banner[]>>> => {
  try {
    const response = await getBanner();

    return response_success<Banner[]>(res, response, "Sukses");
  } catch (error: any) {
    if (error.message === "BANNER_NOT_FOUND") {
      return response_not_found(res, "Banner tidak ditemukan");
    }
    return response_internal_server_error(res, "Terjadi kesalahan pada server");
  }
};
