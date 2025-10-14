const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const sharp = require("sharp");

// Make sure uploads folder exists inside container
const uploadPath = "/app/uploads";
const categoryUploadPath = "/app/uploads/categories";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
if (!fs.existsSync(categoryUploadPath)) fs.mkdirSync(categoryUploadPath, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, "auknotes" + "-" + file.originalname);
  },
});

// Only allow PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF or Word files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Route: Upload PDF
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const fullUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.json({
      message: "PDF uploaded successfully",
      file: {
        fileUrl: fullUrl,
        publicId: req.file.filename,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "File upload failed", error: err.message });
  }
});

// Multer storage for categories
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, categoryUploadPath),
  filename: (req, file, cb) => {
    const name = path.parse(file.originalname).name.replace(/\s+/g, "-").toLowerCase();
    const ext = path.extname(file.originalname);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});
const uploadCategory = multer({ storage: categoryStorage });

/* ----------------- Category Image (single) ----------------- */
router.post("/category", uploadCategory.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const optimizedName = `optimized-${req.file.filename}.webp`;
    const outputPath = path.join(categoryUploadPath, optimizedName);

    await sharp(req.file.path).resize({ width: 800 }).webp({ quality: 80 }).toFile(outputPath);

    fs.unlinkSync(req.file.path);

    res.json({
      message: "Category image uploaded",
      image: {
        imageUrl: `${req.protocol}://${req.get("host")}/uploads/categories/${optimizedName}`,
        publicId: optimizedName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Image processing failed", error: err.message });
  }
});

module.exports = router;
