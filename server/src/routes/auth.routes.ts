import express from "express";
import {
  registerMerchant,
  loginMerchant,
} from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerMerchant);
authRouter.post("/login", loginMerchant);

export default authRouter;
