import { Profile, ProfileUpdateRequest } from "../types/profile.type";
import { queryGetOne, queryUpdateOne } from "./helper/queryHelper";

export const getProfile = async (email: string) => {
  const existingUser = await queryGetOne(
    `SELECT email, first_name, last_name, profile_image FROM "user" WHERE email = $1`,
    [email]
  );

  if (!existingUser) {
    throw new Error("USER_NOT_FOUND");
  }

  return existingUser;
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
