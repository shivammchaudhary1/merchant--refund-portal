import { Application } from "express";
import authRouter from "./auth.routes.js";
import transactionRouter from "./transaction.routes.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const appRouter = (app: Application) => {
  app.use("/api/auth", authRouter);
  app.use("/api/transactions", authMiddleware, transactionRouter);
};

export default appRouter;
