import express from "express";
import {
  getTransactions,
  getTransactionById,
} from "../controller/transaction.controller.js";

const transactionRouter = express.Router();

transactionRouter.get("/", getTransactions);
transactionRouter.get("/:id", getTransactionById);

export default transactionRouter;
