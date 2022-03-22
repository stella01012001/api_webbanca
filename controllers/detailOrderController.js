const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const mysql = require("../sql/mysql");

exports.createNewOrderDetail = asyncMiddleware(async (req, res, next) => {
  const { idOrder, idProduct, Amount } = req.body;
  mysql.query(
    `INSERT INTO detailorders(idOrder, idProduct, Amount ) VALUES (?,?,?)`,
    [idOrder, idProduct, Amount],
    (err, result, fields) => {
      if (err) {
        return next(new ErrorResponse(500, err.sqlMessage));
      }
      res.status(201).json(new SuccessResponse(201, result));
    }
  );
});

exports.getAllDetailOrders = asyncMiddleware(async (req, res, next) => {
  mysql.query(
    `SELECT * FROM detailorders, products WHERE detailorders.idProduct = products.idProduct`,
    async (err, result, fields) => {
      if (err) {
        console.log(err);
      }
      if (result.length > 0) {
        return res.status(200).json(new SuccessResponse(200, result));
      } else {
        return next(new ErrorResponse(404, "No detailorders"));
      }
    }
  );
});
exports.getDetailOrderById = asyncMiddleware(async (req, res, next) => {
  const { idOrder } = req.params;
  if (!idOrder.trim()) {
    return next(new ErrorResponse(400, "idOrder is empty"));
  }
  mysql.query(
    `SELECT * FROM orders, detailorders WHERE orders.id = detailorders.idOrder and orders.id = ?`,
    [idOrder],
    (err, result, fields) => {
      if (err) {
        return next(new ErrorResponse(500, err.sqlMessage));
      }
      if (result.length > 0) {
        res.status(201).json(new SuccessResponse(201, result));
      } else {
        return next(new ErrorResponse(404, "No Orders"));
      }
    }
  );
});
exports.deleteDetailOrderByIdProduct = asyncMiddleware(
  async (req, res, next) => {
    const { idProduct, idOrder } = req.params;
    if (!idProduct.trim() && !idOrder.trim()) {
      return next(new ErrorRespone(400, "idProduct & idOrder is empty"));
    }
    mysql.query(
      `DELETE FROM detailorders where idProduct = ? and idOrder=? `,
      [idProduct, idOrder],
      async (err, result, fields) => {
        if (err) {
          return next(new ErrorResponse(500, err.sqlMessage));
        }
        if (result.affectedRows > 0) {
          return res
            .status(200)
            .json(new SuccessResponse(200, "Delete Successfully"));
        } else {
          return next(new ErrorResponse(404, "No Order"));
        }
      }
    );
  }
);
exports.updateCategoryById = asyncMiddleware(async (req, res, next) => {
  const { idCategory } = req.params;
  const { CategoryName } = req.body;
  if (!idCategory.trim()) {
    return next(new ErrorResponse(400, "idCategory is empty"));
  }
  mysql.query(
    `UPDATE category SET CategoryName = ? WHERE idCategory = ?`,
    [CategoryName, idCategory],
    (err, result, fields) => {
      if (err) {
        return next(new ErrorResponse(500, err.sqlMessage));
      }
      if (result.affectedRows > 0) {
        return res
          .status(200)
          .json(new SuccessResponse(200, "Update Successfully"));
      } else {
        return next(new ErrorResponse(404, "No Category"));
      }
    }
  );
});
