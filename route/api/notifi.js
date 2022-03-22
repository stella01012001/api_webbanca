const express = require("express");
const { authorize } = require("../../middleware/authorize");
const { jwtAuth } = require("../../middleware/jwtAuth");
const notifiController = require("../../controllers/notifiController");
const router = express.Router();
router.use(jwtAuth, authorize("admin", "owner"));
router.get("/", notifiController.getNotifi);
router.get("/report", notifiController.getReport);
router.get("/month", notifiController.getTotalOfMonth);
router.get("/week", notifiController.getTotalOfWeek);

module.exports = router;
