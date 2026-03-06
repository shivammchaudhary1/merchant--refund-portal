import dotenv from "dotenv";
import { EnvironmentConfig } from "../../interfaces/index.js";

dotenv.config();

export const envs: EnvironmentConfig = {
  MONGO_URI:
    process.env.MONGO_URI || "mongodb://localhost:27017/merchant-refund-portal",
  PORT: Number(process.env.PORT) || 8080,
  JWT_SECRET: process.env.JWT_SECRET
    ? process.env.JWT_SECRET
    : "your_jwt_secret_key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
};
