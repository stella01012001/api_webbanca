const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const mysql = require("../sql/mysql");
exports.createNewSlider = asyncMiddleware(async (req, res, next) => {
  const dataImage = req.file.filename;
  const user = req.account.email;
  const dateSlide = new Date();
  mysql.query(
    "SELECT * FROM employees WHERE employees.email = ?",
    [user],
    async (err, result, fields) => {
      if (err) {
        return next(new ErrorResponse(500, err.sqlMessage));
      }
      mysql.query(
        "INSERT INTO slider(idEmployee,image,dateSlide) VALUES (?,?,?)",
        [result[0].id, dataImage,dateSlide],
        (newErr, newResult, newFields) => {
          if (newErr) {
            return next(new ErrorResponse(500, newErr.sqlMessage));
          }
          return res.status(200).json(new SuccessResponse(200, newResult));
        }
      );
    }
  );
});

exports.getSliderById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  if (!id.trim()) {
    return next(new ErrorResponse(400, "id is empty"));
  }
  mysql.query(
    `SELECT * FROM slider WHERE id = ?`,
    [id],
    async (err, result, fields) => {
      if (err) {
        console.log(err);
      }
      if (result.length > 0) {
        return res.status(200).json(new SuccessResponse(200, result));
      } else {
        return next(new ErrorResponse(404, "No Slider"));
      }
    }
  );
});
exports.getSliderAll = asyncMiddleware(async (req, res, next) => {
  mysql.query(`SELECT * FROM slider`, async (err, result, fields) => {
    if (err) {
      throw err;
    }
    if (result.length > 0) {
      return res.status(200).json(new SuccessResponse(200, result));
    } else {
      return next(new ErrorResponse(404, "No Any Blog"));
    }
  });
});
exports.deleteSliderById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  if (!id.trim()) {
    return next(new ErrorResponse(400, "id is empty"));
  }
  mysql.query(
    `DELETE FROM slider where id = ? `,
    [id],
    async (err, result, fields) => {
      if (err) {
        return next(new ErrorResponse(500, err.sqlMessage));
      }
      if (result.affectedRows > 0) {
        return res
          .status(200)
          .json(new SuccessResponse(200, "Delete Successfully"));
      } else {
        return next(new ErrorResponse(404, "No Slider"));
      }
    }
  );
});
exports.updateSliderById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const user = req.account.email;
  const dataImage = req.file.filename;
  if (!id.trim()) {
    return next(new ErrorResponse(400, "id is empty"));
  }

  mysql.query(
    "SELECT * FROM employees WHERE employees.email = ?",
    [user],
    async (err, result, fields) => {
      if (err) {
        return next(new ErrorResponse(500, err.sqlMessage));
      }

      mysql.query(
        "UPDATE slider SET idEmployee = ?, image = ? WHERE id = ?",
        [result[0].id, dataImage, id],
        (newErr, newResult, newFields) => {
          if (newErr) {
            return next(new ErrorResponse(500, newErr.sqlMessage));
          }
          return res.status(200).json(new SuccessResponse(200, newResult));
        }
      );
    }
  );
});
