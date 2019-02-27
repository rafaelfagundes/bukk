// External Dependancies
const boom = require("boom");
const auth = require("../../auth");

// Get Data Models
const Costumer = require("./Costumer");

// Get all costumers
exports.getAllCostumers = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }

    const costumers = await Costumer.find({ company: token.company }).sort({
      fullName: 1
    });
    if (costumers.length) {
      res.status(200).send(costumers);
    } else {
      res.status(404).send({ msg: "Nenhum cliente encontrado" });
    }
  } catch (err) {
    // throw boom.boomify(err);
  }
};

// Get a single costumer
exports.getCostumer = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }
    const _id = req.body.id;
    const costumer = await Costumer.findOne({
      _id: _id,
      company: token.company
    });

    if (costumer) {
      res.status(200).send(costumer);
    } else {
      res.status(404).send({ msg: "Nenhum cliente encontrado" });
    }
  } catch (err) {
    // throw boom.boomify(err);
  }
};

// Find costumers
exports.findCostumers = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }

    let { query } = req.body;

    let regExQuery = new RegExp(query, "i");
    console.log("regExQuery", regExQuery);

    const costumers = await Costumer.find({
      $or: [
        { fullName: { $in: regExQuery } },
        { email: { $in: regExQuery } },
        { "phone.number": { $in: regExQuery } }
      ]
    }).sort({ createdAt: -1 });

    if (costumers) {
      res.status(200).send({ count: costumers.length, result: costumers });
    } else {
      res.status(404).send({ msg: "Nenhum cliente encontrado" });
    }
  } catch (err) {
    // throw boom.boomify(err);
  }
};
