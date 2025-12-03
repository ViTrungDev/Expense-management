import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, default: null }, 

    avatar: { type: String, default: null },

    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },

    providerId: { type: String, default: null },

    active: { type: Boolean, default: true },

    isAdmin: { type: Boolean, default: false },

    lastLogin: { type: Date, default: Date.now },

    otpCode: { type: String },
    
    otpExpires: { type: Date },

  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
