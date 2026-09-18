const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const uploadImage = (req, res) => {
  upload.array("photos", 5)(req, res, (err) => {
    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).send("No files uploaded.");
      }

      if (files.size > 5 * 1024 * 1024) {
        return res.status(400).send("File size exceeds the limit of 5MB.");
      }

      res.status(200).json({
        message: "Files uploaded successfully!",
        files: files,
        id: files.id,
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
};

const deleteImage = (req, res) => {
  const { imageName } = req.params;
  const imagePath = path.join(__dirname, "../uploads", imageName);

  fs.unlink(imagePath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting the image." });
    }
    res.status(200).json({ message: "Image deleted successfully." });
  });
};

module.exports = { uploadImage, deleteImage };
