//Copy hết vào customer.js (route/api)
const express = require("express");
const { authorize } = require("../../middleware/authorize");
const { jwtAuth } = require("../../middleware/jwtAuth");
const customerController = require("../../controllers/customerController");
const upload = require("../../middleware/upload");
const router = express.Router();

router
	.route("/")
	.post(
		jwtAuth,
		authorize("owner"),
		upload.single("image"),
		customerController.createNewCustomer
	)
	.get(
		jwtAuth,
		authorize("owner", "admin"),
		customerController.getAllCustomers
	);

router.delete(
	"/:id",
	jwtAuth,
	authorize("owner"),
	customerController.deleteCustomerById
);

router.patch(
	"/:id",
	jwtAuth,
	authorize("owner"),
	upload.single("image"),
	customerController.updateCustomerById
);
module.exports = router;