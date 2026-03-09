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

export interface iTransactionStatusEvent {
  transactionId: string;
  status?: TransactionStatus;
  note: string;
}

export interface TransactionStatusEventDocument
  extends iTransactionStatusEvent, Document {
  createdAt: Date;
  updatedAt: Date;
}
