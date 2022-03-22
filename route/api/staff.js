const express = require("express");
const { authorize } = require("../../middleware/authorize");
const { jwtAuth } = require("../../middleware/jwtAuth");
const staffController = require("../../controllers/staffController");
const upload = require("../../middleware/upload");
const router = express.Router();
router
	.route("/")
	.post(
		jwtAuth,
		authorize("owner"),
		upload.single("p_image"),
		staffController.createNewStaff
	)
	.get(jwtAuth, authorize("owner", "admin"), staffController.getAllStaffs);

router.delete(
	"/:id",
	jwtAuth,
	authorize("owner"),
	staffController.deleteStaffById
);

router.patch(
	"/:id",
	jwtAuth,
	authorize("owner"),
	upload.single("p_image"),
	staffController.updateEmployeeById
);
router.get("/:id", jwtAuth, authorize("owner"), staffController.getStaffById);
module.exports = router;
