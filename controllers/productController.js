const asyncHandler = require("../middleware/asyncHandler");
const Product = require("../models/productModel");
const Course = require("../models/courseModel");
const fs = require("fs");
const path = require("path");

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;

  // Search filter
  const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: "i" } } : {};

  // Count total products matching search
  const count = await Product.countDocuments({ ...keyword });

  // Paginate + sort newest first
  const products = await Product.find({ ...keyword })
    .sort({ createdAt: -1 })
    .populate("category", "code")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, course, file, type } = req.body;

  const product = await Product.create({
    user: req.user._id,
    name: name || "Untitled Resource",
    course,
    type,
    file,
    size: file?.size || 0,
  });

  // ✅ Link product to its course
  if (course) {
    await Course.findByIdAndUpdate(course, { $addToSet: { resources: product._id } });
  }

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, featured, hasDiscount, discountBy } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Delete old images that are no longer in the new images array
  if (image && Array.isArray(image)) {
    const oldImages = product.image || [];

    for (const oldImg of oldImages) {
      const oldUrl = oldImg.url ? oldImg.url : oldImg;
      const existsInNew = image.some((img) => (img.url ? img.url : img) === oldUrl);

      if (!existsInNew && oldUrl.includes("/uploads/")) {
        const filename = oldUrl.split("/uploads/").pop();
        const filePath = path.join(__dirname, "..", "uploads", filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }

    product.image = image; // update product images
  }

  // Update other fields
  product.name = name ?? product.name;
  product.price = price ?? product.price;
  product.description = description ?? product.description;
  product.category = category ?? product.category;
  // product.countInStock = countInStock ?? product.countInStock;
  product.featured = featured ?? product.featured;

  product.hasDiscount = hasDiscount ?? product.hasDiscount;
  product.discountBy = discountBy ?? product.discountBy;
  product.discountedPrice = hasDiscount
    ? product.price - product.price * discountBy
    : product.price;

  const updatedProduct = await product.save();
  res.status(200).json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // ✅ Unlink from course before deleting
  if (product.course) {
    await Course.findByIdAndUpdate(product.course, { $pull: { resources: product._id } });
  }

  await product.deleteOne();
  res.json({ message: "Product removed" });
});

const getProductsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  console.log(courseId);
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // ✅ Fetch products with pagination, newest first
  const products = await Product.find({ course: courseId }).sort({ createdAt: -1 });

  // ✅ Return paginated response
  res.status(200).json(products);
});

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCourse,
};
