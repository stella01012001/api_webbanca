const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const mysql = require("../sql/mysql");
function isValidEmail(email) {
	const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}
function validatePhoneNumber(phone) {
	var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

	return re.test(phone);
}

exports.createNewCustomer = asyncMiddleware(async (req, res, next) => {
	const { email, Address, Phone, CustomerName } = req.body;
	const image = req.file.filename;
	if (!isValidEmail(email)) {
		return next(new ErrorResponse(400, "Valid Email or Phone"));
	}
	if (!validatePhoneNumber(Phone)) {
		return next(new ErrorResponse(400, "Valid Email or Phone"));
	}
	mysql.query(
		`INSERT INTO customers(email, Address, Phone, CustomerName,image ) VALUES (?,?,?,?,?)`,
		[email, Address, Phone, CustomerName, image],
		(err, result, fields) => {
			if (err) {
				return next(new ErrorResponse(500, err.sqlMessage));
			}
			res.status(201).json(new SuccessResponse(201, result));
		}
	);
});

exports.getAllCustomers = asyncMiddleware(async (req, res, next) => {
	mysql.query(
		`SELECT customers.id, customers.email, customers.Address, customers.Phone, customers.CustomerName, customers.image, account.flag FROM customers LEFT JOIN account ON account.email = customers.email`,
		async (err, result, fields) => {
			if (err) {
				return next(new ErrorResponse(500, err.sqlMessage));
			}
			if (result.length > 0) {
				return res.status(200).json(new SuccessResponse(200, result));
			} else {
				return next(new ErrorResponse(404, "No Customers"));
			}
		}
	);
});

exports.deleteCustomerById = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;
	const { email } = req.body;
	if (!id.trim()) {
		return next(new ErrorResponse(400, "idCustomer is empty"));
	}

	mysql.query(
		`UPDATE account, customers SET account.flag = 0 WHERE account.email = customers.email and customers.id = ? and customers.email = ?`,
		[id, email],
		async (err, result, fields) => {
			if (err) {
				return next(new ErrorResponse(500, err.sqlMessage));
			}
			if (result.affectedRows > 0) {
				return res
					.status(200)
					.json(new SuccessResponse(200, "Delete Successfully"));
			} else {
				return next(new ErrorResponse(404, "No Customer"));
			}
		}
	);
});
exports.updateCustomerById = asyncMiddleware(async (req, res, next) => {
	const { id } = req.params;
	const { email, Address, Phone, CustomerName } = req.body;
	const image = req.file.filename;
	if (!id.trim()) {
		return next(new ErrorResponse(400, "email is empty"));
	}
	if (!email.trim()) {
		return next(new ErrorResponse(400, "email is empty"));
	}
	if (!isValidEmail(email)) {
		return next(new ErrorResponse(400, "Valid Email"));
	}
	if (!validatePhoneNumber(Phone)) {
		return next(new ErrorResponse(400, "Valid Phone"));
	}
	mysql.query(
		`UPDATE customers SET Address=?, Phone=?, CustomerName=?,image=? WHERE email = ?`,
		[Address, Phone, CustomerName, image, email],
		(err, result, fields) => {
			if (err) {
				return next(new ErrorResponse(500, err.sqlMessage));
			}
			if (result.affectedRows > 0) {
				return res
					.status(200)
					.json(new SuccessResponse(200, "Update Successfully"));
			} else {
				return next(new ErrorResponse(404, "No Customer"));
			}
		}
	);
});
