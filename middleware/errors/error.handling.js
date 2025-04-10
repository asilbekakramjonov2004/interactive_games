const { model } = require("../../config/db");
const ApiError = require("../../helpers/api.error");
const logger = require("../../services/logger.service");

module.exports = function (err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    logger.error(`Sintaksis xato: ${err.message}`);
    return res
      .status(400)
      .json({ message: "Bad Request: Invalid JSON syntax" });
  }

  if (err instanceof ApiError) {
    logger.error(`API xato: ${err.message}`);
    return res.status(err.status).json(err.toJson());
  }

  logger.error(`Server xatolik: ${err.message}`);
  return res
    .status(500)
    .json({ message: "Something went wrong. Internal Server Error" });
};
