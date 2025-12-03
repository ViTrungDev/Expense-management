import Goal from "../modules/Goal.js";

// Create a new goal
export const createGoal = async (req, res) => {
  try {
    const { name, targetAmount, savedAmount, deadline } = req.body;

    const goal = await Goal.create({
      userId: req.user.id,
      name,
      targetAmount,
      savedAmount,
      deadline,
    });

    res.status(200).json({ message: "Goal created successfully", goal });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all goals for the user
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Goals fetched successfully", goals });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update a goal (only owner)
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    if (goal.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "You can only update your own goals" });

    Object.assign(goal, req.body);
    await goal.save();

    res.json({ message: "Goal updated successfully", goal });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a goal (only owner)
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    if (goal.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "You can only delete your own goals" });

    await goal.deleteOne();
    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
