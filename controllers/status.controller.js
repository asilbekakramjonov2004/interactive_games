const { errorHandler } = require("../helpers/error_handler")
const bcrypt = require('bcrypt');
const Status = require("../models/status.model");
const { statusValidation } = require("../validation/status.validation");


const addNewStatus =  async (req, res) => {
    try {
        const {error, value} = statusValidation(req.body)
        if(error) {
            errorHandler(error, res)
        }
        const {name} = value
        const checkStatus = await Status.findOne({ where: { name } });
        if (checkStatus) {
            return res.status(400).json({
            success: false,
            message: "Bu status allaqachon mavjud",
        });
        }

        const newStatus = await Status.create({name})
        res.status(201).json({
            success: true,
            message: "Status muvaffaqiyatli yaratildi",
            newStatus,
          });
    } catch (error) {
        errorHandler(error, res)
    }

}

const findAllStatus = async (req, res) => {
    try {
        const status = await Status.findAll();
        res.status(200).json({
            success: true,
            count: status.length,
            status,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const findByIdStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const status = await Status.findByPk(id);
        if (!status) {
            return res.status(404).json({
              success: false,
              message: "Status topilmadi",
            });
          }
      
          res.status(200).json({
            success: true,
            status,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateStatus = async (req, res) => {
    try {
        const {error, value} = statusValidation(req.body)
        if(error) {
            errorHandler(error, res)
            }
        const {id} = req.params;
        const {name} = value

        const [updated] = await Status.update(
            { name },
            { where: { id: req.params.id } }
          );
      
          if (!updated) {
            return res.status(404).json({
              success: false,
              message: "Status topilmadi yoki yangilanmadi",
            });
          }
      
          const updatedStatus = await Status.findByPk(req.params.id);
      
          res.status(200).json({
            success: true,
            message: "Status muvaffaqiyatli yangilandi",
            status: updatedStatus,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteStatus = async (req, res) => {
    try {
        const deleted = await Status.destroy({
            where: { id: req.params.id },
          });
      
          if (!deleted) {
            return res.status(404).json({
              success: false,
              message: "Status topilmadi",
            });
          }
      
          res.status(200).json({
            success: true,
            message: "Status muvaffaqiyatli o'chirildi",
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    addNewStatus,
    findAllStatus,
    findByIdStatus,
    updateStatus,
    deleteStatus
}