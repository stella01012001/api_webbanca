const express = require("express");
const { createNewRole } = require("../../controllers/roleController");
const Role = require("../../database/models/Role");
const { asyncMiddleware } = require("../../middleware/asyncMiddleware");
const ErrorRespone = require("../../model/ErrorResponse");
const SuccessResponse = require("../../model/SuccessResponse");
const roleController = require("../../controllers/roleController");
const { authorize } = require("../../middleware/authorize");
const { jwtAuth } = require("../../middleware/jwtAuth");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("ok");
});

//Cach 2
router.use(jwtAuth, authorize("owner"));
router
  .route("/")
  .post(roleController.createNewRole)
  .get(roleController.getAllRoles);

router.delete(
  "/:roleId",
  asyncMiddleware(async (req, res, next) => {
    const { roleId } = req.params;
    if (!roleId.trim()) {
      return next(new ErrorRespone(400, "RoleId is empty"));
    }
    const deletedRole = await Role.findByIdAndDelete(roleId);
    if (!deletedRole) {
      return next(new ErrorRespone(400, "Can not delete this role"));
    }
    res.status(200).json(new SuccessResponse(200, "Delete Successfully!"));
  })
);

//Update
router.patch(
  "/:roleId",
  asyncMiddleware(async (req, res, next) => {
    const { roleId } = req.params;

    if (!roleId.trim()) {
      return next(new ErrorRespone(400, "roleId is empty"));
    }

    const updatedRole = await Role.findOneAndUpdate({ _id: roleId }, req.body, {
      new: true,
    });
    if (!updatedRole) {
      return next(new ErrorRespone(400, "Can not Update"));
    }
    res.status(200).json(new SuccessResponse(200, updatedRole));
  })
);

module.exports = router;
