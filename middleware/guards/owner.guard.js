// const { errorHandler } = require("../../helpers/error_handler");
// const jwtService = require("../../services/jwtowner.service");



// module.exports=async function(req,res,next){
//     try {
//         const authorization = req.headers.authorization;
//         if (!authorization) {
//           return res
//             .status(403)
//             .send({ message: "authorization token berilmagan" });
//         }
//         const bearer = authorization.split(" ")[0];
//         const token = authorization.split(" ")[1];
//         if (bearer != "Bearer" || !token) {
//           return res
//             .status(403)
//             .send({ message: "bearer yoki token berilmagan" });
//         }

//         const decodedToken = await jwtService.verifyAccessToken(token);
//         req.user=decodedToken
    
//         next()
//     } catch (error) {
//         errorHandler(error,res)
//     }
// }


const { errorHandler } = require("../../helpers/error_handler");
const jwtService = require("../../services/jwtowner.service");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Authorization header noto‘g‘ri yoki yo‘q" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await jwtService.verifyAccessToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    errorHandler(error, res);
  }
};
