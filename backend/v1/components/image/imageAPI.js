const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const keys = require("../../config/keys");
const Image = require("../image/Image");

cloudinary.config({
  cloud_name: keys.cloudinary.cloud_name,
  api_key: keys.cloudinary.api_key,
  api_secret: keys.cloudinary.api_secret
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "img",
  allowedFormats: ["jpg", "png"]
});

const parser = multer({ storage: storage });

router.get("/image/get/:id", (req, res) => {
  Image.findById({ _id: req.params.id }, (err, image) => {
    if (image) {
      res.status(200).json(image);
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  });
});

router.post("/image/add", parser.single("image"), (req, res) => {
  Image.create(req.file) // save image information in database
    .then(newImage => res.status(200).json(newImage))
    .catch(err => res.status(404).json({ error: err }));
});

module.exports = router;
