const logger = require("../../services/logger.service");

const urlerror = async (req, res) => {
  const errorMessage = `Noto'g'ri URL: ${req.originalUrl}`;
  logger.error(errorMessage);
  await res.status(404).json({ message: "404 Not Found: Noto'g'ri URL" });
};

module.exports = urlerror;
