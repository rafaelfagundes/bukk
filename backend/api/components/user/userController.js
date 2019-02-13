const boom = require("boom");
const auth = require("../../auth");
const shortid = require("shortid");
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);
const User = require("./User");
const Employee = require("../employee/Employee");

const Mail = require("../mail/Mail");
const templates = require("../mail/templates/emailTemplates");

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
      msg: error
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    let employee = undefined;
    if (!user) {
      res.status(403);
      res.send({ msg: "Usuário e senha não coincidem." });
    } else {
      let _continue = true;
      if (user.role === "employee") {
        employee = await Employee.findOne({ user: user._id });
        if (!employee.enabled) {
          _continue = false;
          res.status(403).send({
            msg:
              "Usuário desabilitado. Consulte o administrador de sua empresa."
          });
        }
      }
      if (_continue) {
        const result = await user.comparePassword(req.body.password);

        if (result) {
          const _user = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            company: user.company
          };

          if (_user.role === "employee") {
            _user["employee"] = employee._id;
          }

          res.status(200);
          res.send({
            msg: "OK",
            token: auth.sign(_user)
          });
        } else {
          res.status(403);
          res.send({ msg: "Usuário e senha não coincidem." });
        }
      }
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

    _user.firstName = req.body.firstName;
    _user.lastName = req.body.lastName;
    _user.email = req.body.email;
    _user.company = token.company;
    _password = shortid.generate();
    _user.password = _password;

    const resultUser = await _user.save();
    if (resultUser) {
      const _employee = new Employee();
      _employee.user = resultUser._id;
      const resultEmployee = await _employee.save();
      if (resultEmployee) {
        const template = await templates.newEmployee(
          token.company,
          _user.firstName,
          _user.email,
          _password
        );
        const mail = new Mail(
          `Seu novo cadastro no Bukk`,
          template.text,
          template.html,
          _user.email,
          "Bukk Agendador <no-reply@bukk.com.br>"
        );
        mail.send();
        res.status(200).send({ msg: "OK" });
      }
    } else {
      _user.remove();
      res.status(500).send({ msg: "Impossível criar usuário" });
    }
  } catch (error) {
    if (error.code === 11000) {
      res.status(500).send({
        msg: "Já existe um usuário com este email.",
        code: "ALREADY_EXISTS"
      });
    } else {
      res.status(500).send({ msg: error });
    }
  }
};
