import express, { Application, Request, Response } from "express";
import compression from "compression";
import cors from "cors";
import { connectToDatabase } from "./config/database/db.js";
import { envs } from "./config/environments/envs.js";

export const createApp = async () => {
  const app: Application = express();

  // Connect to database
  await connectToDatabase();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(compression());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.get("/", (req: Request, res: Response) => {
    const response = {
      success: true,
      message: "Merchant Refund Portal API is running!",
      data: "Welcome to MRP API",
    };
    res.status(200).json(response);
  });

  // Start the server
  app.listen(envs.PORT, () => {
    console.log(`Server is running on port ${envs.PORT}`);
  });
};
