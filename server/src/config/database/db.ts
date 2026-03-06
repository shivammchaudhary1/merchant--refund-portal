import mongoose from "mongoose";
import { envs } from "../environments/envs.js";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(envs.MONGO_URI);
    console.log("Connected to Database successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
