import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    type: { type: String, enum: ["income", "expense"], required: true },

    amount: { type: Number, required: true },

    note: { type: String, default: "" },

    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
