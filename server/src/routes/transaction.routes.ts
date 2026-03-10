import express from "express";
import {
  getTransactions,
  getTransactionById,
  refundTransaction, 
} from "../controller/transaction.controller.js";

const transactionRouter = express.Router();

transactionRouter.get("/", getTransactions);
transactionRouter.get("/:id", getTransactionById);
transactionRouter.post("/:transactionId", refundTransaction);

export default transactionRouter;
