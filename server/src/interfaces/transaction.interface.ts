import { Document } from "mongoose";

export enum TransactionStatus {
  SUCCESS = "Successful",
  FAILED = "Failed",
  PENDING = "Pending",
  REFUNDED = "Refunded",
  INITIATED = "Initiated",
  PROCESSING = "Processing",
}

export interface iStatusHistory {
  status: TransactionStatus;
  updatedAt: Date;
  refundedAmount?: number;
  note?: string;
}

export interface iTransaction {
  merchantId: string;
  transactionId: string;
  amount: number;
  status: TransactionStatus;
  transactionDate: Date;
  statusTimeline: iStatusHistory[];
}

export interface transactionDocument extends iTransaction, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionQuery {
  merchantId?: string;
  page?: string;
  limit?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}
