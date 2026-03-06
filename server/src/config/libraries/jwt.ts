import jwt, { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { envs } from "../environments/envs.js";
import {
  JwtPayload,
  DecodedJwtPayload,
} from "../../interfaces/jwt.interface.js";

export const createJWT = (payload: JwtPayload): string => {
  try {
    const signOptions: SignOptions = {
      expiresIn: envs.JWT_EXPIRES_IN as StringValue,
    };
    const token = jwt.sign(payload, envs.JWT_SECRET as string, signOptions);
    return token;
  } catch (error) {
    console.error("Error creating JWT:", error);
    throw new Error("Token creation failed");
  }
};

export const verifyJWT = (token: string): DecodedJwtPayload => {
  try {
    const decoded = jwt.verify(token, envs.JWT_SECRET) as DecodedJwtPayload;
    return decoded;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    if ((error as any).name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    throw new Error("Invalid token");
  }
};

export const extractTokenFromHeader = (authHeader: string): string | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};
