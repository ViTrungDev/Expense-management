import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // null = danh mục mặc định

    name: { type: String, required: true },

    type: { type: String, enum: ["income", "expense"], required: true },

    icon: { type: String, default: "📁" },

    color: { type: String, default: "#4CAF50" },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
