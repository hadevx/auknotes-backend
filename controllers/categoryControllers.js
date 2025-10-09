const asyncHandler = require("../middleware/asyncHandler");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, parent, image } = req.body;

    // Check if category with same name exists under same parent
    const existing = await Category.findOne({
      name: name.trim(),
      parent: parent || null,
    });

    if (existing) {
      return res.status(400).json({ message: "Category already exists under this parent" });
    }

    const category = new Category({
      name: name.trim(),
      parent: parent || null,
      image,
    });

    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const deletedCategory = await Category.findOneAndDelete({ name });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully", category: deletedCategory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // category id
    const { name, parent, image, featured } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update fields only if provided
    if (name) category.name = name;
    if (parent !== undefined) category.parent = parent || null;
    if (image !== undefined) category.image = image;
    if (featured !== undefined) category.featured = featured;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
const getCategories = async (req, res) => {
  const pageSize = 5; // categories per page
  const page = Number(req.query.pageNumber) || 1;

  // Optional search
  const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: "i" } } : {};

  // Count total matching categories
  const count = await Category.countDocuments({ ...keyword });

  // Fetch paginated categories
  const categories = await Category.find({ ...keyword })
    .populate("parent", "name")
    .sort({ name: 1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    categories,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
};

const getMainCategoriesWithCounts = asyncHandler(async (req, res) => {
  const categories = await Category.find({ parent: null, featured: true }).limit(4);
  res.json({ categories, total: categories.length });
});

const getMainCategoriesWithCountsPagination = asyncHandler(async (req, res) => {
  const pageSize = 20; // categories per page
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: "i" } } : {};

  // Count how many categories match (for pagination info)
  const total = await Category.countDocuments({ parent: null, ...keyword });

  // Get paginated categories
  const categories = await Category.find({ parent: null, ...keyword })
    .sort({ name: 1 }) // optional sorting by name
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({
    categories,
    page,
    pages: Math.ceil(total / pageSize), // total number of pages
    total, // total categories
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch the category by its _id
  const category = await Category.findById(id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json(category);
});

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  getMainCategoriesWithCounts,
  getMainCategoriesWithCountsPagination,
};
