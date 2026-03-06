import mongoose from "mongoose";
import {
  MerchantDocument,
  MerchantRole,
} from "../interfaces/merchant.interface.js";

const merchantSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(MerchantRole),
      default: MerchantRole.USER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Merchant = mongoose.model<MerchantDocument>("Merchant", merchantSchema);

export default Merchant;
