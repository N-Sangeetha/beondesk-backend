const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const rate_limiter = require("../middleware/rate_limit");
const imageController = require("../controller/image.controller")

//images list
router.get("/images", [auth, rate_limiter],imageController.getImages);

//image download
router.get("/download", auth, imageController.downloadImage);

module.exports = router;
