const multer = require("multer");
const path = require("path");

const fileFilter = (req, file, cb) => {
	if (!file.originalname.match(/\.(jpg||JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
		//cl trong fileFilter nhan 2 tham so
		//1-error
		//2-true||false -> xac dinh co luu hay khong
		return cb(
			new Error(`Do not support ${path.extname(file.originalname)}`),
			false
		);
	}
	cb(null, true);
};
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const fieldname = file.fieldname;
		console.log(fieldname);
		let stringPath = "";
		if (fieldname === "product") {
			stringPath = "products";
		}
		if (fieldname === "slide") {
			stringPath = "slide";
		}
		if (fieldname === "blog") {
			stringPath = "blog";
		}
		if (fieldname === "p_image") {
			stringPath = "p_image";
		}
		cb(null, path.join(`${__dirname}/../../resource/imgs/${stringPath}`)); // luu hinhhhhhhhhhhhhhhhhhhhh
	},
	filename: (req, file, cb) => {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		);
	},
});

const upload = multer({ storage, fileFilter });
module.exports = upload;
