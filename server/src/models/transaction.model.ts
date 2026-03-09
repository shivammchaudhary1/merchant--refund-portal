import mongoose from "mongoose";
import {
  TransactionStatus,
  transactionDocument,
} from "../interfaces/transaction.interface.js";

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      "Initiated",
      "Processing",
      "Successful",
      "Failed",
      "Pending",
      "Refunded",
    ],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const transactionSchema = new mongoose.Schema(
  {
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
    },

    transactionId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    transactionDate: {
      type: Date,
    },
    statusTimeline: [statusHistorySchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

transactionSchema.index({ merchantId: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ transactionDate: -1 });

const Transaction = mongoose.model<transactionDocument>(
  "Transaction",
  transactionSchema,
);
export default Transaction;
