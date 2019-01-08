// External Dependancies
const boom = require("boom");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");

// Get Data Models
const User = require("./User");

// Login user
exports.login = async (req, reply) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const result = await user.comparePassword(req.body.password);

    if (result) {
      const _user = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      };

      reply.code(200);
      return { msg: "OK", token: jwt.sign(_user, config.jwtSecretKey) };
    } else {
      reply.code(403);
      return { msg: "Usuário e senha não coincidem" };
    }
  } catch (err) {
    throw boom.boomify(err);
  }
};
