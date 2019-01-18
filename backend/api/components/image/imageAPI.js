const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const config = require("../../config/config");
const User = require("../user/User");
const Company = require("../company/Company");
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

function getAvatarParser() {
  const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "Bukk/Uploads/Avatar",
    allowedFormats: ["jpg", "png"],
    format: "jpg",
    transformation: { gravity: "auto", height: 300, width: 300, crop: "fill" }
  });

  const parser = multer({ storage: storage });
  return parser;
}

router.post(
  BASE_URL + "/images/avatar",
  getAvatarParser().single("avatar-image"),
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

function getLogoParser() {
  const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "Bukk/Uploads/Logo",
    allowedFormats: ["jpg", "png"],
    format: "png",
    transformation: { if: "w_gt_500", width: 500, crop: "scale" }
  });

  const parser = multer({ storage: storage });
  return parser;
}

router.post(
  BASE_URL + "/images/logo",
  getLogoParser().single("logo-image"),
  verifyToken,
  (req, res) => {
    if (!req.file) {
      res.status(500).send({ msg: "Erro ao carregar imagem" });
    }
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Invalid token"
      });
    } else {
      if (token.role === "owner") {
        res.status(200).send({ msg: "OK", logoUrl: req.file.url });
      } else {
        res.status(403).json({
          msg: "Usuário não autorizado"
        });
      }
    }
  }
);

module.exports = router;
