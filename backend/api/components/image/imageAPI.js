const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const config = require("../../config/config");
const User = require("../user/User");
const Image = require("../image/Image");
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

const logoController = async (req, res) => {
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
      const company = await Company.findById(token.company);
      console.log("company", company);
      const imageObj = await Image.findById(company.logoId);
      console.log("imageObj", imageObj);

      if (imageObj) {
        cloudinary.v2.api.delete_resources(imageObj.publicId, function(
          error,
          result
        ) {
          if (error) {
            console.error("A imagem não pode ser apagada do servidor.");
          }
        });
      }

      const image = new Image({
        bytes: req.file.bytes,
        category: "logo",
        company: token.company,
        createdAt: req.file.created_at,
        format: req.file.format,
        height: req.file.height,
        mimetype: req.file.mimetype,
        secureUrl: req.file.secure_url,
        title: "Logotipo da Empresa",
        url: req.file.url,
        publicId: req.file.public_id,
        version: req.file.version,
        user: token.id,
        width: req.file.width
      });

      const resultImage = await image.save();

      if (resultImage) {
        res
          .status(200)
          .send({ msg: "OK", logoUrl: req.file.url, logoId: resultImage._id });
      } else {
        res.status(500).send({ msg: "Não foi possível atualizar a imagem" });
      }
    } else {
      res.status(403).json({
        msg: "Usuário não autorizado"
      });
    }
  }
};

const avatarController = async (req, res) => {
  const token = auth.verify(req.token);
  if (!token) {
    res.status(403).json({
      msg: "Invalid token"
    });
  }
  if (req.file.url) {
    const user = await User.findById(token.id);
    const imageObj = await Image.findById(user.avatarId);

    if (imageObj) {
      cloudinary.v2.api.delete_resources(imageObj.publicId, function(
        error,
        result
      ) {
        if (error) {
          console.error("A imagem não pode ser apagada do servidor.");
        }
      });
    }

    const image = new Image({
      bytes: req.file.bytes,
      category: "avatar",
      company: token.company,
      createdAt: req.file.created_at,
      format: req.file.format,
      height: req.file.height,
      mimetype: req.file.mimetype,
      secureUrl: req.file.secure_url,
      title: "Avatar do Usuário",
      url: req.file.url,
      publicId: req.file.public_id,
      version: req.file.version,
      user: token.id,
      width: req.file.width
    });

    const resultImage = await image.save();

    if (resultImage) {
      User.updateOne(
        { _id: token.id },
        { avatar: req.file.url, avatarId: resultImage._id }
      )
        .then(response => {
          res.status(200).send({ msg: "OK", avatarUrl: req.file.url });
        })
        .catch(err => {
          res.status(500).send({ msg: err });
        });
    }
  }
};

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
  avatarController
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
  logoController
);

router.post(BASE_URL + "/images/delete", verifyToken, (req, res) => {
  const token = auth.verify(req.token);
  if (!token) {
    res.status(403).json({
      msg: "Invalid token"
    });
  }

  cloudinary.v2.api.delete_resources(req.body.publicId, function(
    error,
    result
  ) {
    if (result) {
      res.status(200).send({ msg: "OK" });
    } else if (error) {
      res.status(500).send({ msg: "Erro ao apagar imagem" });
    } else {
      res.status(500).send({ msg: "Erro ao apagar imagem" });
    }
  });
});

router.post(BASE_URL + "/images/get", verifyToken, (req, res) => {
  const token = auth.verify(req.token);
  if (!token) {
    res.status(403).json({
      msg: "Invalid token"
    });
  }

  Image.findById(req.body.id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(404).send(error);
    });
});

module.exports = router;
