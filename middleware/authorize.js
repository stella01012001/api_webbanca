//rest operator (...)

const ErrorRespone = require("../model/ErrorResponse");

//
exports.authorize = (...roles) => (req, res, next) => {
  //khi do roles laf 1 array
  if (!req.account) {
    return next(new ErrorRespone(401, "Unauthorization"));
  }

  if (!roles.includes(req.account.idRole)) {
    return next(
      new ErrorRespone(403, "Dont have permission to access this user")
    );
  }
  next();
};
