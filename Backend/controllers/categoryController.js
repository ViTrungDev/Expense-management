import Category from "../modules/Category.js";

// Get all categories (optionally filter by type)
export const getCategories = async (req, res) => {
  try {
    const { type } = req.query; // optional
    const query = type ? { type } : {};
    const categories = await Category.find(query).sort({ name: 1 });
    res.status(200).json({ categories, count: categories.length });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, type, icon, color } = req.body;

    const existing = await Category.findOne({ name, type });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, type, icon, color });
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    Object.assign(category, req.body);
    await category.save();

    res.status(200).json({ message: "Category updated", category });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.deleteOne();
    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
