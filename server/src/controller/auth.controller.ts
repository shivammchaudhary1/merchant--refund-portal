import { Request, Response } from "express";
import Merchant from "../models/merchant.model.js";
import { createJWT } from "../config/libraries/jwt.js";
import { hashPassword, comparePassword } from "../config/libraries/bcrypt.js";
import { MerchantRole } from "../interfaces/index.js";

const registerMerchant = async (req: Request, res: Response) => {
  try {
    const { businessName, email, password } = req.body;

    // Check if merchant already exists
    const existingMerchant = await Merchant.findOne({ email });

    if (existingMerchant) {
      return res
        .status(400)
        .json({ message: "Merchant already exists, please login" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new merchant
    const newMerchant = new Merchant({
      businessName,
      email,
      password: hashedPassword,
      role: MerchantRole.USER,
      isVerified: false,
    });
    await newMerchant.save();

    res.status(201).json({ message: "Merchant registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering merchant:", error });
  }
};

const loginMerchant = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    } else if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Find merchant by email
    const merchant = await Merchant.findOne({ email });

    if (!merchant) {
      return res
        .status(400)
        .json({ message: "Merchant not found, please register" });
    }

    // Check password
    const isMatch = await comparePassword(password, merchant.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token = createJWT({
      userId: merchant._id.toString(),
      role: merchant.role,
    });

    res.status(200).json({ name: merchant.businessName, email, token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in merchant:", error });
  }
};

export { registerMerchant, loginMerchant };
