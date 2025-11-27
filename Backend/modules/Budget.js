import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    amount: { type: Number, required: true },

    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema);
