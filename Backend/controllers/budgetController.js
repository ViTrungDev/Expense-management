import Budget from "../modules/Budget.js";

// Create a new budget
export const createBudget = async (req, res) => {
  try {
    const { name, amount, startDate, endDate } = req.body;

    const budget = await Budget.create({
      userId: req.user.id,
      name,
      amount,
      startDate,
      endDate,
    });

    res.status(200).json({ message: "Budget created successfully", budget });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all budgets for the user
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Budgets fetched successfully", budgets });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update a budget (only owner)
export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    if (budget.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "You can only update your own budgets" });

    Object.assign(budget, req.body);
    await budget.save();

    res.json({ message: "Budget updated successfully", budget });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a budget (only owner)
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    if (budget.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "You can only delete your own budgets" });

    await budget.deleteOne();
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
