// External Dependancies
const boom = require("boom");
const auth = require("../../auth");

// Get Data Models
const Costumer = require("./Costumer");

// Get all services
exports.getAllCostumers = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }

    const costumers = await Costumer.find({});
    if (costumers.length) {
      res.status(200).send(costumers);
    } else {
      res.status(404).send({ msg: "Nenhum cliente encontrado" });
    }
  } catch (err) {
    // throw boom.boomify(err);
  }
};
