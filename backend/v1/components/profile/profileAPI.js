const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

const Profile = require("./Profile");
const User = require("../user/User");

// @route GET api/v1/profile
// @desc Get current user profile
// @access Private
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (!profile) {
        errors.noProfile = "Perfil não encontrado";
        res.status(404); // NOT FOUND
        res.send(errors);
      } else {
        res.status(200);
        res.send({ ok: "OK" });
      }
    });
  }
);

// @route POST api/v1/profile/create
// @desc Create current user profile
// @access Private

router.get(
  "/profile/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const profileFields = req.body;
    profileFields.user = req.user;

    res.status(200);
    res.send(profileFields);
  }
);

module.exports = router;
