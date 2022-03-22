const express = require("express");
const { ConnectMongo } = require("../../database/connectMongo");
const mongoUpload = require("../../middleware/mongoUpload");
const upload = require("../../middleware/upload");
const ErrorRespone = require("../../model/ErrorResponse");
const SuccessResponse = require("../../model/SuccessResponse");
const router = express.Router();
//single: 1 file
//array:(, so luong file max)nhieu file
router.post("/", mongoUpload.single("avatar"), (req, res, next) => {
  //single
  //   if (!req.file) {
  //     return next(new ErrorRespone(500, "No file"));
  //   }
  //   res.status(200).json(new SuccessResponse(200, req.file.filename));
  //array
  // if (!req.files) {
  //   return next(new ErrorRespone(500, "No file"));
  // }
  // const arr = req.files.map((val) => {
  //   return val.filename;
  // });
  // res.status(200).json(new SuccessResponse(200, arr.toString()));
  res.status(200).json(new SuccessResponse(200, req.file.filename));
});
router.get("/:filename", (req, res, next) => {
  const { filename } = req.params;
  const file = ConnectMongo.gfs.find({ filename }).toArray((err, files) => {
    if (!files || !files.length) {
      return next(new ErrorRespone(404, "File is not found"));
    }
    ConnectMongo.gfs.openDownloadStreamByName(filename).pipe(res);
  });
});
module.exports = router;
