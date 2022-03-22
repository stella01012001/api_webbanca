const express = require("express");
const { asyncMiddleware } = require("../../middleware/asyncMiddleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("../../sql/mysql");
const SuccessResponse = require("../../model/SuccessResponse");
const ErrorResponse = require("../../model/SuccessResponse");
const router = express.Router();

router.post(
  "/register",
  asyncMiddleware(async (req, res, next) => {
    const { name, email, password, role, isActive } = req.body;
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    mysql.query(
      `INSERT INTO user(name,email,password,role,isActive) VALUES (?,?,?,'guest',true)`,
      [name, email, hashedPassword, role, isActive],
      (err, result, fields) => {
        if (err) {
          return next(new ErrorResponse(500, err.sqlMessage));
        }
        res.status(201).json(new SuccessResponse(201, result));
      }
    );
  })
);

router.post(
  "/login",
  asyncMiddleware(async (req, res, next) => {
    const { email, password } = req.body;
    mysql.query(
      `SELECT * FROM user WHERE email = ?`,
      [email],
      async (err, result, fields) => {
        if (err) {
          console.log(err);
        }
        //     console.log("result.email", result[0].email);
        if (result.length > 0) {
          const checkPass = await bcrypt.compare(password, result[0].password);

          if (checkPass) {
            const token = jwt.sign(
              {
                //payload
                email: result[0].email,
                name: result[0].name,
                role: result[0].role,
              },
              process.env.JWT_KEY //secret key
            );
            console.log(token);
            return res.status(200).json(new SuccessResponse(200, token));
          } else {
            return next(new ErrorResponse(404, "Email is not found"));
          }
        }
      }
    );
  })
);
module.exports = router;
