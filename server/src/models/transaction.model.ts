import mongoose from "mongoose";
import {
  TransactionStatus,
  transactionDocument,
} from "../interfaces/transaction.interface.js";

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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

transactionSchema.index({ merchantId: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ transactionDate: -1 });

export default mongoose.model<transactionDocument>(
  "Transaction",
  transactionSchema,
);
