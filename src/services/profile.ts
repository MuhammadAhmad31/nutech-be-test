import fs from "fs";
import path from "path";
import { Profile, ProfileUpdateRequest } from "../types/profile.type";
import { queryGetOne, queryUpdateOne } from "./helper/queryHelper";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const IMAGE_DIR = path.join(__dirname, "../../public");

export const getProfile = async (email: string) => {
  const user = await queryGetOne<Profile>(
    `SELECT email, first_name, last_name, profile_image FROM "user" WHERE email = $1`,
    [email]
  );

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.profile_image) {
    user.profile_image = `${BASE_URL}/public/${user.profile_image}`;
  }

  return user;
};

export const updateProfile = async (
  body: ProfileUpdateRequest,
  email: string
): Promise<Profile | null> => {

  const existingUser = await queryGetOne<Profile>(
    `SELECT email FROM "user" WHERE email = $1`,
    [email]
  );

  if (!existingUser) {
    throw new Error("USER_NOT_FOUND");
  }

  const updates: string[] = [];
  const params: any[] = [];
  let i = 1;

  if (body.first_name !== undefined) {
    updates.push(`first_name = $${i++}`);
    params.push(body.first_name);
  }

  if (body.last_name !== undefined) {
    updates.push(`last_name = $${i++}`);
    params.push(body.last_name);
  }

  if (updates.length === 0) return existingUser;

  const sql = `
    UPDATE "user"
    SET ${updates.join(", ")}
    WHERE email = $${i}
    RETURNING email, first_name, last_name, profile_image
  `;

  params.push(email);

  const updatedUser = await queryUpdateOne<Profile>(sql, params);
  return updatedUser;
};

export const updateProfileImage = async (
  email: string,
  newImagePath: string
): Promise<Profile | null> => {
  const existingUser = await queryGetOne<Profile>(
    `SELECT email, profile_image FROM "user" WHERE email = $1`,
    [email]
  );

  if (!existingUser) {
    throw new Error("USER_NOT_FOUND");
  }

  if (existingUser.profile_image) {
    const oldImageFullPath = path.join(
      IMAGE_DIR,
      existingUser.profile_image
    );

    fs.unlink(oldImageFullPath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error("Gagal menghapus gambar lama:", err);
      }
    });
  }

  const sql = `
    UPDATE "user"
    SET profile_image = $1
    WHERE email = $2
    RETURNING email, first_name, last_name, profile_image
  `;
  const params = [newImagePath, email];
  const updated = await queryUpdateOne<Profile>(sql, params);

  if (updated?.profile_image) {
    updated.profile_image = `${BASE_URL}/public/${updated.profile_image}`;
  }

  return updated;
};