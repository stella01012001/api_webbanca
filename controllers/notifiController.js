const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const mysql = require("../sql/mysql");

exports.getNotifi = asyncMiddleware(async (req, res, next) => {
	mysql.query(`call notifi ;`, (err, result, field) => {
		if (err) {
			console.log(err);
			return next(new ErrorResponse(500, err.sqlMessage));
		}
		return res.status(200).json(new SuccessResponse(200, result));
	});
});
exports.getReport = asyncMiddleware(async (req, res, next) => {
	mysql.query(`call statistical;`, (err, result, field) => {
		if (err) {
			return next(new ErrorResponse(500, err.sqlMessage));
		}
		return res.status(200).json(new SuccessResponse(200, result));
	});
});
exports.getTotalOfMonth = asyncMiddleware(async (req, res, next) => {
	mysql.query(`call total_of_month ;`, (err, result, field) => {
		if (err) {
			console.log(err);
			return next(new ErrorResponse(500, err.sqlMessage));
		}
		const arrMonth = ["Month", "Sales"];
		let newResult = [];
		result[0].forEach((element) => {
			newResult = Object.entries(element);
			newResult.unshift(arrMonth);
		});
		console.log(newResult);
		return res.status(200).json(new SuccessResponse(200, newResult));
	});
});
exports.getTotalOfWeek = asyncMiddleware(async (req, res, next) => {
	mysql.query(`call total_of_week ;`, (err, result, field) => {
		if (err) {
			console.log(err);
			return next(new ErrorResponse(500, err.sqlMessage));
		}
		const arrMonth = ["Week", "Sales"];
		let newResult = [];
		result[0].forEach((element) => {
			newResult = Object.entries(element);
			newResult.unshift(arrMonth);
		});
		console.log(newResult);
		return res.status(200).json(new SuccessResponse(200, newResult));
	});
});
