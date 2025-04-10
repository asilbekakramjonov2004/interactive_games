const { errorHandler } = require("../../helpers/error_handler");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtService = require("../../services/jwtadmin.service");



module.exports=async function(req,res,next){
    try {
        const authorization = req.headers.authorization;
        console.log(authorization);
        if (!authorization) {
          return res
            .status(403)
            .send({ message: "authorization token berilmagan" });
        }
        const bearer = authorization.split(" ")[0];
        const token = authorization.split(" ")[1];
        if (bearer != "Bearer" || !token) {
          return res
            .status(403)
            .send({ message: "bearer yoki token berilmagan" });
        }
        const decodedToken = await jwtService.verifyAccessToken(token);
        req.user=decodedToken
          
        next()
    } catch (error) {
        errorHandler(error,res)
    }
}