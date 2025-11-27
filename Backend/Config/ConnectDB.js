// Config/ConnectDB.js
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ExpenseManagementDB";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI); 
    console.log("✅ MongoDB connected: ExpenseManagementDB");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
