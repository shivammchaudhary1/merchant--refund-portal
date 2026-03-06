import { Document } from "mongoose";

// Merchant roles
export enum MerchantRole {
  ADMIN = "admin",
  USER = "user",
}

// Basic merchant data
export interface Merchant {
  businessName: string;
  email: string;
  password: string;
  role: MerchantRole;
  isVerified: boolean;
}

// Merchant with MongoDB document properties
export interface MerchantDocument extends Merchant, Document {
  createdAt: Date;
  updatedAt: Date;
}

// For creating new merchants
export interface CreateMerchant {
  businessName: string;
  email: string;
  password: string;
  role?: MerchantRole;
  isVerified?: boolean;
}

// For API responses (no password)
export interface MerchantResponse {
  _id: string;
  businessName: string;
  email: string;
  role: MerchantRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
