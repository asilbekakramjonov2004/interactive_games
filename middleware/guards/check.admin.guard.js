const ApiError = require("../../helpers/api.error");

module.exports = function (req, res, next) {
  if (!req.user?.is_creator) {
        return res
          .status(400)
          .send({ message: "Ruhsat berilmagan Admin" });

  }
  next();
};
