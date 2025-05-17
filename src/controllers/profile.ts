import { Request, Response } from "express";
import { getProfile, updateProfile, updateProfileImage } from "../services/profile";
import {
  response_bad_request,
  response_internal_server_error,
  response_not_found,
  response_success,
} from "../utils/response.utils";
import { Profile, ProfileUpdateRequest } from "../types/profile.type";
import { ResponseData } from "../types/response.type";
import path from "path";

export const get = async (
  req: Request,
  res: Response
): Promise<Response<ResponseData<Profile>>> => {
  const { email } = res.locals.userData;

  try {
    const response = await getProfile(email);
    return response_success<Profile>(res, response, "Sukses");
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return response_not_found(res, "User tidak ditemukan");
    }
    return response_internal_server_error(res, "Terjadi kesalahan pada server");
  }
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response<ResponseData<Profile>>> => {
  const { email } = res.locals.userData;
  const { first_name, last_name }: ProfileUpdateRequest = req.body;

  if (!first_name && !last_name) {
    return response_bad_request(res, "Minimal satu field harus diisi");
  }

  try {
    const updated = await updateProfile({ first_name, last_name }, email);

    if (!updated) {
      return response_not_found(res, "User tidak ditemukan");
    }

    return response_success<Profile>(res, updated, "Update profile berhasil");
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return response_not_found(res, "User tidak ditemukan");
    }

    return response_internal_server_error(res, "Terjadi kesalahan pada server");
  }
};

export const updateImage = async (
  req: Request,
  res: Response
): Promise<Response<ResponseData<Profile>>> => {
  const { email } = res.locals.userData;
  const file = req.file;

  if (!file) {
    return response_bad_request(res, "Gambar tidak ditemukan");
  }

  const imagePath = path.join("images", file.filename);

  try {
    const updated = await updateProfileImage(email, imagePath);

    if (!updated) {
      return response_not_found(res, "User tidak ditemukan");
    }

    return response_success<Profile>(res, updated, "Gambar profil berhasil diperbarui");
  } catch (error: any) {
    return response_internal_server_error(res, "Terjadi kesalahan saat memperbarui gambar");
  }
};