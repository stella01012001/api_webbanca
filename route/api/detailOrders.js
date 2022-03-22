const express = require("express");
const { authorize } = require("../../middleware/authorize");
const { jwtAuth } = require("../../middleware/jwtAuth");
const detailOrderController = require("../../controllers/detailOrderController");
const router = express.Router();

router.use(jwtAuth, authorize("admin", "owner"));
router.post("/", detailOrderController.createNewOrderDetail);
router.get("/", detailOrderController.getAllDetailOrders);
router.get("/:idOrder", detailOrderController.getDetailOrderById);

// router.delete("/:idOrder", orderController.deleteCategoryById);

// router.patch("/:idOrder", orderController.updateCategoryById);
module.exports = router;
