const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const mysql = require("../sql/mysql");
exports.createNewCategory = asyncMiddleware(async (req, res, next) => {
	const { p_name, p_idParent } = req.body;
	mysql.query(
		"CALL creat_category(?,?);",
		[p_idParent, p_name],
		async (err, result, fields) => {
			if (err) {
				return next(new ErrorResponse(500, err.sqlMessage));
			}
			return res.status(200).json(new SuccessResponse(200, result));
		}
	);
});

exports.getAllCategoryParent = asyncMiddleware(async (req, res, next) => {
	mysql.query(
		`SELECT * FROM category WHERE parent_id IS NULL`,
		async (err, result, fields) => {
			if (err) {
				console.log(err);
			}
			if (result.length > 0) {
				return res.status(200).json(new SuccessResponse(200, result));
			} else {
				return next(new ErrorResponse(404, "No Category"));
			}
		}
	);
});
exports.getCategoryByParentId = asyncMiddleware(async (req, res, next) => {
	const { idParent } = req.params;
	mysql.query(
		`SELECT * FROM category WHERE parent_id = ?`,
		[idParent],
		async (err, result, fields) => {
			if (err) {
				console.log(err);
			}
			if (result.length > 0) {
				return res.status(200).json(new SuccessResponse(200, result));
			} else {
				return next(new ErrorResponse(404, "No Category"));
			}
		}
	);
});
exports.deleteCategoryById = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;
	if (!id.trim()) {
		return next(new ErrorResponse(400, "idCategory is empty"));
	}
	mysql.query(`CALL delete_category(?)`, [id], async (err, result, fields) => {
		if (err) {
			return next(new ErrorResponse(500, err.sqlMessage));
		}
		return res.status(200).json(new SuccessResponse(200, result));
	});
});
exports.updateCategoryById = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;
	const { CategoryName } = req.body;
	if (!id.trim()) {
		return next(new ErrorResponse(400, "idCategory is empty"));
	}
	if (CategoryName.length === 0) {
		return next(new ErrorResponse(400, "CategoryName is empty"));
	}
	mysql.query(
		`UPDATE category SET CategoryName = ? WHERE id = ?`,
		[CategoryName, id],
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
exports.getAllCategories = asyncMiddleware(async (req, res, next) => {
	mysql.query(`SELECT * FROM category`, async (err, result, fields) => {
		if (err) {
			console.log(err);
		}
		if (result.length > 0) {
			return res.status(200).json(new SuccessResponse(200, result));
		} else {
			return next(new ErrorResponse(404, "No Category"));
		}
	});
});
exports.getCategoryById = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;
	mysql.query(
		`SELECT * FROM category WHERE id = ?`,
		[id],
		async (err, result, fields) => {
			if (err) {
				console.log(err);
			}
			if (result.length > 0) {
				return res.status(200).json(new SuccessResponse(200, result));
			} else {
				return next(new ErrorResponse(404, "No Category"));
			}
		}
	);
});