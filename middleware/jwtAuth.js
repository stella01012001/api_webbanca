const jwt = require("jsonwebtoken");
const ErrorResponse = require("../model/ErrorResponse");
const mysql = require("../sql/mysql");
const jwtAuth = async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  //phan biet token bearer: kieu token
  console.log(token);
  if (!token) {
    return next(new ErrorResponse(401, "Unauthorized"));
  }
  //kiem tra token
  try {
    //neu verify token thanh cong, tra ve thong tin trong payload
    const payload = jwt.verify(token, process.env.JWT_KEY);
    console.log(payload);
    mysql.query(
      `SELECT * FROM account WHERE email=?`,
      [payload.email],
      (err, result, fields) => {
        if (err) throw err;
        if (result.length > 0) {
          req.account = payload;
          next();
        } else {
          return next(new ErrorResponse(401, "Unauthorized"));
        }
      }
    );
  } catch (error) {
    return next(new ErrorResponse(401, "Unauthorized"));
  }
};

exports.jwtAuth = jwtAuth;
