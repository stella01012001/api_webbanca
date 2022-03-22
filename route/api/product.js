const express = require("express");
const productController = require("../../controllers/productController");
const { authorize } = require("../../middleware/authorize");
const { jwtAuth } = require("../../middleware/jwtAuth");
const upload = require("../../middleware/upload");
const router = express.Router();
router.use(jwtAuth,authorize("admin","owner"))
router
	.route("/")
	.get(productController.getAllProducts)
	//  .post(productController.createNewProduct);
	.post(
		upload.single("product"),
		productController.createNewProduct
	);

router
	.route("/:id")
	.get( productController.getProductById)
	.delete(productController.deleteProductById)
	.patch(
		upload.single("product"),
		productController.updateProductById
	);

router.patch(
	"/reset/:id",
	productController.refreshProduct
);

module.exports = router;