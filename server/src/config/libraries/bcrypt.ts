import bcrypt from "bcrypt";
import { envs } from "../environments/envs.js";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = envs.SALT_ROUNDS || 1;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Password hashing failed");
  }
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (error) {
    console.error("Error comparing password:", error);
    throw new Error("Password comparison failed");
  }
};
