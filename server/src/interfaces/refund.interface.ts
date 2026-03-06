import { Document } from "mongoose";

export interface iRefund {
  transactionId: string;
  merchantId: string;
  amount: number;
  reason: string;
}

export interface RefundDocument extends iRefund, Document {
  createdAt: Date;
  updatedAt: Date;
}
