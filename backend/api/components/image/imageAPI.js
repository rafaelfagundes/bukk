const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const config = require("../../config/config");
const User = require("../user/User");
const auth = require("../../auth");

const BASE_URL = "/api";

function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== "undefined") {
    req.token = bearerHeader.split(" ")[1];
    next(); // Next middleware
  } else {
    res.sendStatus(403); // Forbidden
  }
}

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "Bukk/Assets/User/Uploads",
  allowedFormats: ["jpg", "png"]
});

const parser = multer({ storage: storage });

router.post(
  BASE_URL + "/images/avatar",
  parser.single("avatar-image"),
  verifyToken,
  (req, res) => {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Invalid token"
      });
    }
    if (req.file.url) {
      User.updateOne({ _id: token.id }, { avatar: req.file.url })
        .then(response => {
          res.status(200).send({ msg: "OK", avatarUrl: req.file.url });
        })
        .catch(err => {
          res.status(500).send({ msg: err });
        });
    }
  }
);

module.exports = router;
