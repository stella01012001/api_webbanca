const express = require("express");
const blogController = require("../../controllers/blogController");
const { authorize } = require("../../middleware/authorize");
const { jwtAuth } = require("../../middleware/jwtAuth");
const upload = require("../../middleware/upload");
const router = express.Router();

//router.use(jwtAuth, authorize("admin","owner"));
router
	.route("/")
	.get(blogController.getBlogAll)
	.post(upload.single("blog"), blogController.createNewBlog);

router
	.route("/:idBlog")
	.get(blogController.getBlogById)
	.delete(blogController.deleteBlogById)
	.patch(upload.single("blog"), blogController.updateBlogById);

module.exports = router;
