const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const mysql = require("../sql/mysql");
exports.createNewOrder = asyncMiddleware(async (req, res, next) => {
  const { total, email, Payment, OrderDate, Status, Note, idPromotion } =
    req.body;
  mysql.query(
    `INSERT INTO orders(total,email,Payment,OrderDate,Status,Note,idPromotion) VALUES (?,?,?,?,?,?,?)`,
    [total, email, Payment, OrderDate, Status, Note, idPromotion],
    (err, result, fields) => {
      if (err) {
        return next(new ErrorResponse(500, err.sqlMessage));
      }
      res.status(201).json(new SuccessResponse(201, result));
    }
  );
});

exports.getAllOrders = asyncMiddleware(async (req, res, next) => {
  mysql.query(
    `SELECT orders.id, total, Payment, status_order.name, Address, Note, idCustomer,OrderDate FROM orders LEFT JOIN status_order ON orders.Status = status_order.id`,
    async (err, result, fields) => {
      if (err) {
        console.log(err);
      }
      if (result.length > 0) {
        return res.status(200).json(new SuccessResponse(200, result));
      } else {
        return next(new ErrorResponse(404, "No Orders"));
      }
    }
  );
});
exports.getOrderById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  if (!id.trim()) {
    return next(new ErrorResponse(400, "idOrder is empty"));
  }
  mysql.query(
    `SELECT products.ProductName, products.Image, detailorders.Amount FROM detailorders LEFT JOIN products ON detailorders.idProduct = products.id WHERE detailorders.idOrder = ?`,
    [id],
    (err, result, fields) => {
      if (err) {
        console.log(err.sqlMessage);
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
exports.getCustomerByIdOrder = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  if (!id.trim()) {
    return next(new ErrorResponse(400, "idOrder is empty"));
  }
  mysql.query(
    `SELECT customers.email, customers.Address, customers.CustomerName, customers.Phone FROM customers WHERE customers.id = ?`,
    [id],
    (err, result, fields) => {
      if (err) {
        console.log(err.sqlMessage);
        return next(new ErrorResponse(500, err.sqlMessage));
      }
      if (result.length > 0) {
        res.status(201).json(new SuccessResponse(201, result));
      } else {
        return next(new ErrorResponse(404, "No Customer"));
      }
    }
  );
});
exports.deleteOrderById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  if (!idOrder.trim()) {
    return next(new ErrorRespone(400, "idOrder is empty"));
  }
  mysql.query(
    `DELETE FROM orders where id = ? `,
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
        return next(new ErrorResponse(404, "No Order"));
      }
    }
  );
});
exports.updateOrderById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  
  const { Status } = req.body;
  console.log("check : " + req.body);
  if (!id.trim()) {
    return next(new ErrorResponse(400, "idOrder is empty"));
  }
  mysql.query(
    `UPDATE orders SET Status=? WHERE id = ?`,
    [Status, id],
    (err, result, fields) => {
      if (err) {
        return next(new ErrorResponse(500, err.sqlMessage));
      }
      if (result.affectedRows > 0) {
        return res
          .status(200)
          .json(new SuccessResponse(200, "Update Successfully"));
      } else {
        return next(new ErrorResponse(404, "No Order"));
      }
    }
  );
});
