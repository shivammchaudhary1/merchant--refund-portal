import mongoose from "mongoose";
import { RefundDocument } from "../interfaces/refund.interface.js";

const refundSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
    },
    originalAmount: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    reason: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Refund = mongoose.model<RefundDocument>("Refund", refundSchema);
export default Refund;
