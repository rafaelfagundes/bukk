// External Dependancies
const boom = require("boom");
const auth = require("../../auth");

// Get Data Models
const User = require("./User");

// Login user
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const result = await user.comparePassword(req.body.password);

    if (result) {
      const _user = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      };

      res.status(200);
      res.send({
        msg: "OK",
        token: auth.sign(_user)
      });
    } else {
      res.status(403);
      res.send({ msg: "Usuário e senha não coincidem" });
    }
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.testAuth = async (req, res) => {
  const token = auth.verify(req.token);
  if (token) {
    res.json({
      msg: "OK",
      token
    });
  } else {
    res.status(403).json({
      msg: "Invalid token"
    });
  }
};
