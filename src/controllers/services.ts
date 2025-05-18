import { Request, Response } from "express";
import { ResponseData } from "../types/response.type";

import { response_internal_server_error, response_not_found, response_success } from "../utils/response.utils";
import { Service } from "../types/service.type";
import { getServices } from "../services/services";

export const get = async(
    req: Request,
    res: Response
): Promise<Response<ResponseData<Service[]>>> => {
    try {
        const response = await getServices();

        return response_success<Service[]>(res, response, "Sukses");
    } catch (error: any) {
        if(error.message === "BANNER_NOT_FOUND") {
            return response_not_found(res, "Banner tidak ditemukan");
        }
        return response_internal_server_error(res, "Terjadi kesalahan pada server");
    }
}