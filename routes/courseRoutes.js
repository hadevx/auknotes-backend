const express = require("express");
const router = express.Router();

const { protectUser, protectAdmin } = require("../middleware/authMiddleware");
const {
  createCourse,
  deleteCourse,
  updateCourse,
  getCourses,
  getFeaturedCourses,
  getCourseById,
  getAllCourses,
} = require("../controllers/courseControllers");

router.post("/", protectUser, protectAdmin, createCourse);

router.get("/featured", getFeaturedCourses);

router.get("/", getCourses);
router.get("/all", getAllCourses);

router.delete("/:id", protectUser, protectAdmin, deleteCourse);

router.put("/:id", protectUser, protectAdmin, updateCourse);

router.get("/:id", getCourseById);

module.exports = router;
