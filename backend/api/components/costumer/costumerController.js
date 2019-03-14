const boom = require("boom");
const auth = require("../../auth");
const Costumer = require("./Costumer");
const _ = require("lodash");

// Get all costumers
exports.getAllCostumers = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }
    let costumers = undefined;
    let costumersCount = undefined;

    if (req.body.page !== undefined && req.body.limit !== undefined) {
      const _skip = req.body.page * req.body.limit;
      const _limit = req.body.limit;

      costumers = await Costumer.find({ company: token.company })
        .sort({ normalizedFullName: "asc" })
        .skip(_skip)
        .limit(_limit)
        .exec();
      costumersCount = await Costumer.count({ company: token.company });
      if (costumers.length) {
        res
          .status(200)
          .send({ costumers, count: costumersCount, page: req.body.page + 1 });
      } else {
        res.status(404).send({ msg: "Nenhum cliente encontrado" });
      }
    } else {
      costumers = await Costumer.find({ company: token.company }).sort({
        normalizedFullName: "asc"
      });
      costumersCount = costumers.length;
      if (costumers.length) {
        res.status(200).send({ costumers, count: costumersCount });
      } else {
        res.status(404).send({ msg: "Nenhum cliente encontrado" });
      }
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
    }).select("firstName lastName gender email phone notes tags address");

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
    query = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let regExQuery = new RegExp(query, "i");

    const _skip = req.body.page * req.body.limit;
    const _limit = req.body.limit;

    const countCostumers = await Costumer.count({
      $or: [
        // { fullName: { $in: regExQuery } },
        { normalizedFullName: { $in: regExQuery } },
        { email: { $in: regExQuery } },
        { "phone.number": { $in: regExQuery } }
      ]
    });
    const costumers = await Costumer.find({
      $or: [
        // { fullName: { $in: regExQuery } },
        { normalizedFullName: { $in: regExQuery } },
        { email: { $in: regExQuery } },
        { "phone.number": { $in: regExQuery } }
      ]
    })
      .sort({ normalizedFullName: "asc" })
      .skip(_skip)
      .limit(_limit)
      .exec();

    if (costumers) {
      res
        .status(200)
        .send({ count: countCostumers, costumers, page: req.body.page + 1 });
    } else {
      res.status(404).send({ msg: "Nenhum cliente encontrado" });
    }
  } catch (err) {
    // throw boom.boomify(err);
  }
};

// Get Notes
exports.getCostumerNotes = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }

    const { id } = req.body;
    const [costumers] = await Costumer.find({ _id: id }, "notes");
    const notes = _.orderBy(costumers.notes, "updatedAt", "desc");

    if (costumers.notes.length) {
      res.status(200).send({ msg: "OK", notes });
    } else {
      res.status(404).send({ msg: "Sem notas" });
    }
  } catch (error) {}
};

// Save Clients
exports.saveCostumer = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }

    let result = undefined;
    if (req.body.newOrEdit === "new") {
      req.body.client["company"] = token.company;
      result = await Costumer.create(req.body.client);
    }
    if (req.body.newOrEdit === "edit") {
      result = await Costumer.updateOne(
        { _id: req.body.client._id },
        req.body.client
      );
    }

    if (req.body.newOrEdit === "edit" && result.ok) {
      res.status(200).send({ msg: "OK" });
    } else if (req.body.newOrEdit === "new" && result) {
      res.status(200).send({ msg: "OK" });
    } else {
      res.status(404).send({ msg: "Erro ao salvar informações do cliente" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ msg: "Erro ao salvar informações do cliente", error });
  }
};

// Save notes
exports.saveCostumerNotes = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }

    const { id, notes } = req.body;

    const result = await Costumer.updateOne({ _id: id }, { notes });

    if (result.ok) {
      res.status(200).send({ msg: "OK" });
    } else {
      res.status(404).send({ msg: "Notas não puderam ser atualizadas" });
    }
  } catch (error) {}
};
