const { errorHandler } = require("../helpers/error_handler")
const Feedbacks = require("../models/feedbacks.model")
const bcrypt = require('bcrypt');
const { feedbackValidation } = require("../validation/feedbacks.validation");


const addNewFeedback =  async (req, res) => {
  try {
      const { error, value } = feedbackValidation(req.body);
      if (error) {
          return errorHandler(error, res);
      }
      
      const { client_id, contract_id, rating, comment } = value;

      if (rating < 1 || rating > 5 || typeof rating !== "number") {
          return res.status(400).json({
              success: false,
              message: "Rating 1 dan 5 gacha bo'lgan son bo'lishi kerak",
          });
      }

      const feedback = await Feedbacks.create({
          client_id,
          contract_id,
          rating,
          comment,
      });

      return res.status(201).json({
          success: true,
          message: "Feedback muvaffaqiyatli yaratildi",
          feedback,
      });
  } catch (error) {
      errorHandler(error, res);
  }
};

const findAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedbacks.findAll();
        res.status(200).json({
            success: true,
            feedbacks,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const findByIdFeedback = async (req, res) => {
    try {
        const {id} = req.params;
        const feedback = await Feedbacks.findByPk(id);
        if (!feedback) {
            return res.status(404).json({
              success: false,
              message: "Feedback topilmadi",
            });
          }
      
          res.status(200).json({
            success: true,
            feedback,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateFeedback = async (req, res) => {
    try {
        const {error, value} = feedbackValidation(req.body)
        if(error) {
            errorHandler(error, res)
        }

        const {id} = req.params;
        const {client_id, contract_id, rating, comment} = value
        if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
            return res.status(400).json({
              success: false,
              message: "Rating 1 dan 5 gacha bo'lgan son bo'lishi kerak",
            });
          }

          const [updated] = await Feedbacks.update(
            { client_id, contract_id, rating, comment },
            {
              where: { id: req.params.id },
            }
          );
      
          if (!updated) {
            return res.status(404).json({
              success: false,
              message: "Feedback topilmadi yoki yangilanmadi",
            });
          }
      
          const updatedFeedback = await Feedbacks.findByPk(req.params.id);
      
          res.status(200).json({
            success: true,
            message: "Feedback muvaffaqiyatli yangilandi",
            review: updatedFeedback,
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteFeedback = async (req, res) => {
    try {
        const deleted = await Feedbacks.destroy({
            where: { id: req.params.id },
          });
      
          if (!deleted) {
            return res.status(404).json({
              success: false,
              message: "Feedback topilmadi",
            });
          }
          res.status(200).json({
            success: true,
            message: "Feedback muvaffaqiyatli o'chirildi",
          });
    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    addNewFeedback,
    findAllFeedbacks,
    findByIdFeedback,
    updateFeedback,
    deleteFeedback
}