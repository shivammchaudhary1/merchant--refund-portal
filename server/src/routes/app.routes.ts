import { Application } from "express";
import authRouter from "./auth.routes.js";

const appRouter = (app: Application) => {
  app.use("/api/auth", authRouter);
};

export default appRouter;
