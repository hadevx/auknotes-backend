const express = require("express");
const router = express.Router();
const { protectUser, protectAdmin } = require("../middleware/authMiddleware");
const { registerLimiter, loginLimiter } = require("../utils/registerLimit");
const {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  createAddress,
  getAddress,
  updateAddress,
  loginAdmin,
  forgetPassword,
  resetPassword,
  getGovernorates,
  toggleBlockUser,
  getBlockStatus,
  toggleFollow,
} = require("../controllers/userController");
const {
  registerValidation,
  loginValidation,
  addressValidation,
} = require("../middleware/validateMiddleware");

/* /api/users */

// Client routes
router.post("/login", loginValidation, loginUser);
router.post("/register", registerLimiter, registerValidation, registerUser);
router.get("/address/:userId", protectUser, getAddress);
router.post("/address", protectUser, addressValidation, createAddress);
router.put("/address", protectUser, updateAddress);
router.get("/profile", protectUser, getUserProfile);
router.put("/profile", protectUser, updateUserProfile);
router.post("/logout", logoutUser);

// Admin routes
router.post("/admin", loginLimiter, loginValidation, loginAdmin);
router.get("/governorates", getGovernorates);
router.get("/", protectUser, protectAdmin, getUsers);
router.put("/:id", protectUser, updateUser);
router.delete("/:id", protectUser, protectAdmin, deleteUser);
router.get("/:id", getUserById);
router.patch("/:id", protectUser, protectAdmin, toggleBlockUser);
router.get("/block-status/:id", protectUser, getBlockStatus);

router.post("/admin/logout", logoutUser);

router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
// Follow/unfollow a user
router.post("/:id/follow", protectUser, toggleFollow);

module.exports = router;
