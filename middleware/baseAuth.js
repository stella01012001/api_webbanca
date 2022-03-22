const ErrorResponse = require("../model/ErrorResponse");

exports.baseAuth = async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  //kiem tra co token tren header chuaw
  //phan biet token bearer: kieu token
  console.log(token);
  if (!token) {
    return next(new ErrorRespone(401, "Base token is required"));
  }
  //Neu ton tai token
  console.log(token);
  const decode = new Buffer.from(token, "base64").toString();
  console.log(decode);
  if (
    `${process.env.BASEAUTH_USER}:${process.env.BASEAUTH_PASSWORD}` === decode
  ) {
    next();
  } else {
    return next(new ErrorResponse(401, "Base token is invalid"));
  }
};
