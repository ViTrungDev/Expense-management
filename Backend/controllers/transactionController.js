import Transaction from "../modules/Transaction.js";
import Category from "../modules/Category.js";


// ===============================
// CREATE TRANSACTION
// ===============================
export const createTransaction = async (req, res) => {
  try {
    const { categoryId, type, amount, note, date } = req.body;

    // Validate input
    if (!categoryId || !type || !amount) {
      return res.status(400).json({
        message: "categoryId, type và amount là bắt buộc",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "type phải là 'income' hoặc 'expense'",
      });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      categoryId,
      type,
      amount,
      note: note || "",
      date: date || new Date(),
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ===============================
// GET TRANSACTIONS BY USER
// ===============================
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .populate("categoryId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Transactions fetched successfully",
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE TRANSACTION
// ===============================
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only update your own transactions",
      });
    }

    Object.assign(transaction, req.body);
    await transaction.save();

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ===============================
// DELETE TRANSACTION
// ===============================
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own transactions",
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
