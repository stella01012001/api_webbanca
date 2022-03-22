const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const mysql = require("../sql/mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SuccessResponse = require("../model/SuccessResponse");
function isValidEmail(email) {
	const regex =
		/^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
	return regex.test(email);
}

exports.register = asyncMiddleware(async (req, res, next) => {
	const { email, Password, idRole, flag } = req.body;
	const salt = await bcrypt.genSalt(12);
	const hashedPassword = await bcrypt.hash(Password, salt);
	if (!isValidEmail(email)) {
		return next(new ErrorResponse(400, "Valid Email"));
	}
	mysql.query(
		`INSERT INTO account(email, Password, idRole, flag ) VALUES (?,?,'owner',true)`,
		[email, hashedPassword, idRole, flag],
		(err, result, fields) => {
			if (err) {
				return next(new ErrorResponse(500, err.sqlMessage));
			}
			res.status(201).json(new SuccessResponse(201, result));
		}
	);
});

exports.login = asyncMiddleware(async (req, res, next) => {
	const { email, Password } = req.body;
	mysql.query(
		`SELECT * FROM account WHERE email = ? and flag <> 0`,
		[email],
		async (err, result, fields) => {
			if (err) {
				console.log(err);
			}
			// console.log("result.email", result[0].email);
			// console.log("result.email", result[0].Password);
			// console.log("result.email", result.length);
			if (result.length > 0) {
				const checkPass = await bcrypt.compare(Password, result[0].Password);
				console.log("Password,", Password, result[0].Password);

				console.log("checkPass,", checkPass);
				if (checkPass) {
					const token = jwt.sign(
						{
							//payload
							email: result[0].email,
							UserName: result[0].UserName,
							idRole: result[0].idRole,
						},
						process.env.JWT_KEY //secret key
					);
					const role = result[0].idRole;
					const emailRes = result[0].email;

					return res
						.status(200)
						.json(
							new SuccessResponse(200, { token, idRole: role, email: emailRes })
						);
				} else {
					return next(new ErrorResponse(404, "Password is wrong"));
				}
			} else {
				return next(new ErrorResponse(404, "Email is not found"));
			}
		}
	);
});

exports.logout = asyncMiddleware(async (req, res, next) => {
	const token = req.headers.authorization;
	if (token) {
		delete req.headers.authorization;
		console.log(req.headers["authorization"]);
		return res.status(200).json(new SuccessResponse(200, "Logged out"));
	}
});

exports.refreshAccount = asyncMiddleware(async (req, res, next) => {
	const { email } = req.body;
	mysql.query(
		`UPDATE account SET flag = 1 WHERE email = ? AND flag = 0`,
		[email],
		(err, result, fields) => {
			if (err) {
				return next(new ErrorResponse(500, err.sqlMessage));
			}
			if (result.affectedRows > 0) {
				return res
					.status(200)
					.json(new SuccessResponse(200, `Rest Successfully User ${email}`));
			} else {
				return next(new ErrorResponse(404, `No User has ${email}`));
			}
		}
	);
});

exports.changePassword = asyncMiddleware(async (req, res, next) => {
	const email = req.account.email;
	const { Password, newPassword } = req.body;
	mysql.query(
		`SELECT * FROM account WHERE email = ? and flag <> 0`,
		[email],
		async (err, result, fields) => {
			if (err) {
				console.log(err);
			}
			if (result.length > 0) {
				const checkPass = await bcrypt.compare(Password, result[0].Password);
				if (checkPass) {
					const salt = await bcrypt.genSalt(12);
					const hashedPassword = await bcrypt.hash(newPassword, salt);
					mysql.query(
						`UPDATE account SET Password = ? WHERE email = ?`,
						[hashedPassword, email],
						(err, result, fields) => {
							if (err) {
								return next(new ErrorResponse(500, err.sqlMessage));
							}
							if (result.affectedRows > 0) {
								return res
									.status(200)
									.json(new SuccessResponse(200, `Successfully`));
							} else {
								return next(new ErrorResponse(404, `No User has ${email}`));
							}
						}
					);
				} else {
					return next(new ErrorResponse(404, "Password is wrong"));
				}
			} else {
				return next(new ErrorResponse(404, "Email is not found"));
			}
		}
	);
});
