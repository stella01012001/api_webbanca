const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const mysql = require("../sql/mysql");
exports.createNewBlog = asyncMiddleware(async (req, res, next) => {
	const { title, content } = req.body;
	const dataImage = req.file.filename;
	const date = new Date();
	const user = req.account.email;
	mysql.query(
	  "SELECT * FROM employees WHERE employees.email = ?",
	  [user],
	  async (err, result, fields) => {
		if (err) {
		  return next(new ErrorResponse(500, err.sqlMessage));
		}
		mysql.query(
		  "INSERT INTO blog(idEmployee,image,date,titleBlog,contentBlog) VALUES (?,?,?,?,?)",
		  [result[0].id, dataImage, date, title, content],
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

exports.getBlogById = asyncMiddleware(async (req, res, next) => {
	const { idBlog } = req.params;
	mysql.query(
		`SELECT * FROM blog WHERE id = ?`,
		[idBlog],
		async (err, result, fields) => {
			if (err) {
				console.log(err);
			}
			if (result.length > 0) {
				return res.status(200).json(new SuccessResponse(200, result));
			} else {
				return next(new ErrorResponse(404, "No Blog"));
			}
		}
	);
});
exports.getBlogAll = asyncMiddleware(async (req, res, next) => {
	mysql.query(`SELECT * FROM blog`, async (err, result, fields) => {
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
exports.deleteBlogById = asyncMiddleware(async (req, res, next) => {
	const { idBlog } = req.params;
	if (!idBlog.trim()) {
		return next(new ErrorResponse(400, "idCategory is empty"));
	}
	mysql.query(
		`DELETE FROM blog where blog.id = ? `,
		[idBlog],
		async (err, result, fields) => {
			if (err) {
				return next(new ErrorResponse(500, err.sqlMessage));
			}
			if (result.affectedRows > 0) {
				return res
					.status(200)
					.json(new SuccessResponse(200, "Delete Successfully"));
			} else {
				return next(new ErrorResponse(404, "No Category"));
			}
		}
	);
});
exports.updateBlogById = asyncMiddleware(async (req, res, next) => {
	const { idBlog } = req.params;
	const { title, content } = req.body;
	const dataImage = req.file.filename;
	const date = new Date();
	const user = req.account.email;
	if (!idBlog.trim()) {
	  return next(new ErrorResponse(400, "idBlog is empty"));
	}
	if (title.length === 0) {
	  return next(new ErrorResponse(400, "title is empty"));
	}
	console.log("file", req.file);
	mysql.query(
	  "SELECT * FROM employees WHERE employees.email = ?",
	  [user],
	  async (err, result, fields) => {
		if (err) {
		  return next(new ErrorResponse(500, err.sqlMessage));
		}
		mysql.query(
		  "UPDATE blog SET idEmployee = ?, image = ?, date = ?, titleBlog = ?,contentBlog=? WHERE id = ?",
		  [result[0].id, dataImage, date, title, content, idBlog],
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
