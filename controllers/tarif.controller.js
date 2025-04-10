const Tarif = require("../models/tarif.model");
const { tarifValidation } = require("../validation/tarif.validation");
const { errorHandler } = require("../helpers/error_handler");

const addNewTarif = async (req, res) => {
  try {
    const { error, value } = tarifValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }

    const { name, discount_percent } = value;

    const newTarif = await Tarif.create({ name, discount_percent });
    res.status(201).send({ message: "New Tarif added", newTarif });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllTarif = async (req, res) => {
  try {
    const tarif = await Tarif.findAll();
    res.status(200).send({ tarif });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findByIdTarif = async (req, res) => {
  try {
    const { id } = req.params;
    const tarif = await Tarif.findByPk(id);
    if (!tarif) {
      return res.status(404).json({
        success: false,
        message: "Tarif not found",
      });
    }
    res.status(200).json({
      success: true,
      tarif,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateTarif = async (req, res) => {
  try {
    const { error, value } = tarifValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }

    const { id } = req.params;
    const { name, discount_percent } = value;


    const checkTarif = await Tarif.findByPk(id);
    if (!checkTarif) {
      return res.status(404).json({
        success: false,
        message: "Tarif not found",
      });
    }


    const [updated] = await Tarif.update(value, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Tarif not updated",
      });
    }

    const updatedTarif = await Tarif.findByPk(id);
    res.status(200).json({
      success: true,
      message: "Tarif successfully updated",
      tarif: updatedTarif,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteTarif = async (req, res) => {
  try {
    const { id } = req.params;
    const tarif = await Tarif.destroy({
      where: { id },
    });
    if (!tarif) {
      return res.status(404).json({
        success: false,
        message: "Tarif not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Tarif successfully deleted",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewTarif,
  findAllTarif,
  findByIdTarif,
  updateTarif,
  deleteTarif,
};
