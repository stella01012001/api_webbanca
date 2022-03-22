const express = require("express");
const sliderController = require("../../controllers/sliderController");
const { authorize } = require("../../middleware/authorize");
const { jwtAuth } = require("../../middleware/jwtAuth");
const upload = require("../../middleware/upload");
const router = express.Router();

router.use(jwtAuth, authorize("admin","owner"));
router
  .route("/")
  .get(sliderController.getSliderAll)
  //  .post(productController.createNewProduct);
  .post(upload.single("slide"), sliderController.createNewSlider);

router
  .route("/:id")
  .get(sliderController.getSliderById)
  .delete(sliderController.deleteSliderById)
  .patch(upload.single("slide"), sliderController.updateSliderById);

module.exports = router;
