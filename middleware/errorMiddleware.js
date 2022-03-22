const ErrorResponse = require("../model/ErrorResponse");

const errorMiddleware = (err, req, res, next) => {
  let errors = { ...err };
  if (!err.code && err.message) {
    errors.code = 500;
    errors.message = err.message;
  }
  // console.log(errors);
  // mongo Dupplicate docs
  if (err.code === 11000) {
    errors = new ErrorResponse(400, err.keyValue);
    for (let i in errors.message) {
      errors.message[i] = `${errors.message[i]} is already exist`;
    }
  }

  //ObjectId validator
  if (err.name === "CastError") {
    errors.code = 400;
    errors.message = "Id is invalid";
  }
  // mongoValidator
  if (err.name === "ValidationError") {
    errors = new ErrorResponse(400, err.errors);
    for (let i in err.errors) {
      errors.message[i] = errors.message[i].message;
    }
  }

  /**
   * {code, message, success: false}
   */
  console.log(errors.code);
  res.status(errors.code || 500).json({
    success: false,
    code: errors.code,
    message: errors.message || "Server error",
  });
  // res.status(err.code).json({ code: err.code, success: false, message: err.message });
  next();
};

exports.errorMiddleware = errorMiddleware;
