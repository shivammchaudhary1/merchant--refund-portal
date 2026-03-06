import mongoose from "mongoose";
import {
  TransactionStatus,
  TransactionStatusEventDocument,
} from "../interfaces/transaction.interface.js";

const eventSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model<TransactionStatusEventDocument>(
  "TransactionStatusEvent",
  eventSchema,
);
