const express = require("express");
const { authorize } = require("../../middleware/authorize");
const { jwtAuth } = require("../../middleware/jwtAuth");
const orderController = require("../../controllers/orderController");
const router = express.Router();

router.use(jwtAuth, authorize("admin","owner"));

router.get("/" ,orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.get( "/customer/:id",  orderController.getCustomerByIdOrder);

router.delete(
  "/:id",
  orderController.deleteOrderById
);

router.patch(
  "/:id",
  orderController.updateOrderById
);
module.exports = router;
