import mongoose from "mongoose";
import { ENV } from "../lib/env.js";

export const connectDB = async () => {
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) throw new Error("MONGO_URI is not set");

    const mongo = await mongoose.connect(ENV.MONGO_URI);
    console.log("mongodb connected:", mongo.connection.host);
  } catch (error) {
    console.error("error:", error);
    process.exit(1);
  }
};
