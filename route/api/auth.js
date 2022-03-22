const express = require("express");

const authController = require("../../controllers/authController");
const { authorize } = require("../../middleware/authorize");
const { jwtAuth } = require("../../middleware/jwtAuth");
const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);
router.get("/logout", jwtAuth, authController.logout);
router.patch(
	"/reset",
	jwtAuth,
	authorize("owner"),
	authController.refreshAccount
);
router.patch(
	"/changepassword",
	jwtAuth,
	authorize("admin"),
	authController.changePassword
);
module.exports = router;
