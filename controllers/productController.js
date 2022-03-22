const { asyncMiddleware } = require("../middleware/asyncMiddleware");

const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const mysql = require("../sql/mysql");
const fs = require("fs");

exports.getAllProducts = asyncMiddleware(async (req, res, next) => {
	mysql.query(`SELECT * FROM products`, (err, result, fields) => {
		if (err) {
			return next(new ErrorResponse(500, err.sqlMessage));
		}
		if (result.length > 0) {
			res.status(201).json(new SuccessResponse(201, result));
		} else {
			return next(new ErrorResponse(404, "No Products"));
		}
	});
});
exports.createNewProduct = asyncMiddleware(async (req, res, next) => {
	const {
		ProductName,
		Price,
		Date,
		Amount,
		Description,
		Distributor,
		idCategory,
	} = req.body;

	const Remark = Boolean(req.body.Remark);
	//const mime = req.file.mimetype;
	// const dataImage = fs.readFileSync(`uploads/${req.file.filename}`);
	const dataImage = req.file.filename;
	mysql.query(
		`INSERT INTO products(ProductName,
      Price,
      Date,
      Amount,
      Description,
      Remark,
      Image,
      Distributor,
      idCategory
     
  ) VALUES (?,?,?,?,?,?,?,?,?)`,
		[
			ProductName,
			Price,
			Date,
			Amount,
			Description,
			Remark,
			dataImage,
			Distributor,
			idCategory,
		],
		(err, result, fields) => {
			if (err) {
				return next(new ErrorResponse(500, err.sqlMessage));
			}
			res.status(201).json(new SuccessResponse(201, result));
		}
	);
});
exports.deleteProductById = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;
	if (!id.trim()) {
		return next(new ErrorResponse(400, "idProduct is empty"));
	}
	mysql.query(
		`UPDATE products SET flag = 0 WHERE id = ?`,
		[id],
		(err, result, fields) => {
			if (err) {
				return next(new ErrorResponse(500, err.sqlMessage));
			}
			if (result.affectedRows > 0) {
				return res
					.status(200)
					.json(new SuccessResponse(200, `Delete Successfully Product ${id}`));
			} else {
				return next(new ErrorResponse(404, `No Product has ${id}`));
			}
		}
	);
});
exports.refreshProduct = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;
	if (!id.trim()) {
		return next(new ErrorResponse(400, "idProduct is empty"));
	}
	mysql.query(
		`UPDATE products SET flag = 1 WHERE id = ? AND flag = 0`,
		[id],
		(err, result, fields) => {
			if (err) {
				return next(new ErrorResponse(500, err.sqlMessage));
			}
			if (result.affectedRows > 0) {
				return res
					.status(200)
					.json(new SuccessResponse(200, `Reset Successfully Product ${id}`));
			} else {
				return next(new ErrorResponse(404, `No Product has ${id}`));
			}
		}
	);
});
exports.getProductById = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;
	if (!id.trim()) {
		return next(new ErrorResponse(400, "idProduct is empty"));
	}
	mysql.query(
		`SELECT * FROM products WHERE id= ?`,
		[id],
		(err, result, fields) => {
			if (err) {
				return next(new ErrorResponse(500, err.sqlMessage));
			}
			if (result.length > 0) {
				res.status(201).json(new SuccessResponse(201, result));
			} else {
				return next(new ErrorResponse(404, "No Products"));
			}
		}
	);
});
exports.updateProductById = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;
	const {
		Price,
		Amount,
		Description,
		
		Distributor,
	} = req.body;
	if (!id.trim()) {
		return next(new ErrorResponse(400, "idProduct is empty"));
	}
	const Remark = Boolean(req.body.Remark);
	const dataImage = req.file.filename;
	mysql.query(
		`UPDATE products SET Price=?,
								Amount=?,
								Description=?,
								Remark=?,
								Image=?,
								Distributor=?
							 WHERE id = ?`,
		[
			Price,
			Amount,
			Description,
			Remark,
			dataImage,
			Distributor,
			id,
		],
		(err, result, fields) => {
			if (err) {
				return next(new ErrorResponse(500, err.sqlMessage));
			}
			if (result.affectedRows > 0) {
				return res
					.status(200)
					.json(
						new SuccessResponse(200, `Update product has ${id} Successfully`)
					);
			} else {
				return next(new ErrorResponse(404, "No product"));
			}
		}
	);
});
