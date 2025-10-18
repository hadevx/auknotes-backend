const asyncHandler = require("../middleware/asyncHandler");
const Course = require("../models/courseModel");

const createCourse = asyncHandler(async (req, res) => {
  const { name, code, image } = req.body;
  const course = await Course.create({ name, code, image });
  res.status(201).json(course);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedCourse = await Course.findByIdAndDelete(id);

  if (!deletedCourse) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.status(200).json(deletedCourse);
});

// Update
const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, code, image, isFeatured, isClosed } = req.body;

  const course = await Course.findById(id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Update fields only if provided
  if (name) course.name = name;
  if (code) course.code = code;
  if (image !== undefined) course.image = image;
  if (isFeatured !== undefined) course.isFeatured = isFeatured;
  if (isClosed !== undefined) course.isClosed = isClosed;

  const updatedCourse = await course.save();
  res.json(updatedCourse);
});

const getCourses = async (req, res) => {
  const pageSize = 20; // categories per page
  const page = Number(req.query.pageNumber) || 1;

  // Optional search
  const keyword = req.query.keyword ? { code: { $regex: req.query.keyword, $options: "i" } } : {};

  // Count total matching categories
  const count = await Course.countDocuments({ ...keyword });

  // Fetch paginated categories
  const courses = await Course.find({ ...keyword })
    .sort({ isClosed: 1, createdAt: -1 }) // show open first, then newest
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    courses,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
};

const getFeaturedCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isFeatured: true }).limit(4);
  res.json(courses);
});

const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  /*   // 🚫 Prevent access if closed
  if (course.isClosed) {
    return res.status(403).json({ message: "This course is not yet available." });
  } */

  res.status(200).json(course);
});
const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});

  res.status(200).json(courses);
});

module.exports = {
  createCourse,
  deleteCourse,
  updateCourse,
  getCourses,
  getFeaturedCourses,
  getCourseById,
  getAllCourses,
};
