// External Dependancies
const boom = require("boom");
const auth = require("../../auth");

// Get Data Models
const User = require("./User");

// Get User Data
exports.getUser = async (req, res) => {
  const token = auth.verify(req.token);
  if (!token) {
    res.status(403).json({
      msg: "Token inválido."
    });
  }
  try {
    const user = await User.findById(
      token.id,
      "address role firstName lastName gender birthday email createdAt avatar phone"
    );
    res.status(200).send(user);
  } catch (error) {
    res.status(403).json({
      msg: "Something went wrong"
    });
  }
};

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

// Update user
exports.updateUser = async (req, res) => {
  const token = auth.verify(req.token);
  if (!token) {
    res.status(403).json({
      msg: "Token inválido."
    });
  }

  try {
    const user = await User.updateOne({ _id: token.id }, req.body);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).json({
        msg: "Error: can not update User"
      });
    }
  } catch (error) {
    res.status(404).json({
      msg: "Error: can not update User"
    });
  }
};

// Update user
exports.updateUserPassword = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }
    const user = await User.findOne({ _id: token.id });
    const result = await user.comparePassword(req.body.actual);

    if (!result) {
      res.status(403).send({ msg: "A senha atual está incorreta." });
    }
    if (req.body.new !== req.body.confirmation) {
      res
        .status(400)
        .send({ msg: "A senha nova e a confimação não coincidem." });
    }
    const update = await User.update(
      { _id: token.id },
      { password: req.body.new }
    );
    console.log(update);

    res.status(200).send({ msg: "OK" });
  } catch (error) {
    res.status(500).send({ msg: error });
  }
};

exports.addUserByAdmin = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }

    const _user = new User();
    console.log(req.body);

    _user.firstName = req.body.firstName;
    _user.lastName = req.body.lastName;
    _user.email = req.body.email;
    _user.password = "123456"; // TODO: gerar dinamicamente

    console.log(_user);
    const result = await _user.save();
    res.status(200).send({ msg: "OK" });
  } catch (error) {
    res.status(500).send({ msg: error });
  }
};
