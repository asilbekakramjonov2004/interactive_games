const { errorHandler } = require("../../helpers/error_handler");
const jwtServiceClient = require("../../services/jwtclients.service");
const jwtServiceAdmin = require("../../services/jwtadmin.service");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "authorization token berilmagan" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedClient = await jwtServiceClient.verifyAccessToken(token);
      req.user = decodedClient; 
      return next();
    } catch (error) {

      try {
        const decodedAdmin = await jwtServiceAdmin.verifyAccessToken(token);
        req.user = decodedAdmin;
        return next();
      } catch (adminError) {
        return res.status(403).json({ message: "Notogri token" });
      }
    }
  } catch (error) {
    errorHandler(error, res);
  }
};