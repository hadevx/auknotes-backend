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
  toggleLikeCourse,
  purchaseAllCourses,
} = require("../controllers/courseControllers");

router.post("/", protectUser, protectAdmin, createCourse);

router.get("/featured", getFeaturedCourses);

router.get("/", getCourses);

router.get("/all", getAllCourses);

router.post("/purchase-all", protectUser, purchaseAllCourses);

router.delete("/:id", protectUser, protectAdmin, deleteCourse);

router.put("/:id", protectUser, protectAdmin, updateCourse);

router.get("/:id", getCourseById);

router.put("/:id/like", protectUser, toggleLikeCourse);

module.exports = router;
