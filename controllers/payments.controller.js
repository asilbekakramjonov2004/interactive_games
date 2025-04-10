const { errorHandler } = require("../helpers/error_handler")
const Payments = require("../models/payments.model")
const bcrypt = require('bcrypt');
const { paymentValidation } = require("../validation/payment.validation");


const addNewPayment =  async (req, res) => {
    try {
        const {error, value} = paymentValidation(req.body)
        if(error) {
            errorHandler(error, res)
         }
        const {contract_id, amount, payment_date, payment_method, created_at, status} = value

        const newPayment = await Payments.create({contract_id, amount, payment_date, payment_method, created_at, status})
        res.status(201).send({message: "New payment added", newPayment})
    } catch (error) {
        errorHandler(error, res)
    }

}

const findAllPayments = async (req, res) => {
    try {
        const payments = await Payments.findAll();
        res.status(200).json({
            success: true,
            payments,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const findByIdPayment = async (req, res) => {
    try {
        const {id} = req.params;
        const payment = await Payments.findByPk(id);
        if (!payment) {
            return res.status(404).json({
              success: false,
              message: "Payment topilmadi",
            });
          }
      
          res.status(200).json({
            success: true,
            payment,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const updatePayment = async (req, res) => {
    try {
        const {error, value} = paymentValidation(req.body)
        if(error) {
            errorHandler(error, res)
         }
        const {id} = req.params;
        const {contract_id, amount, payment_date, payment_method, created_at, status} = value

        const [updated] = await Payments.update(
            {contract_id, amount, payment_date, payment_method, created_at, status},
            {
              where: { id: req.params.id },
            }
          );
      
          if (!updated) {
            return res.status(404).json({
              success: false,
              message: "Payment topilmadi yoki yangilanmadi",
            });
          }
      
          const updatedPayment = await Payments.findByPk(req.params.id);
      
          res.status(200).json({
            success: true,
            message: "Payment muvaffaqiyatli yangilandi",
            payment: updatedPayment,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const deletePayment = async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await Payments.destroy({where:{id}});
        if (!deleted) {
            return res.status(404).json({
              success: false,
              message: "Payment topilmadi",
            });
          }
      
          res.status(200).json({
            success: true,
            message: "Payment muvaffaqiyatli o'chirildi",
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    addNewPayment,
    findAllPayments,
    findByIdPayment,
    updatePayment,
    deletePayment
}