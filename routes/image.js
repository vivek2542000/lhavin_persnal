const express = require("express");

const imageC = require(".././public/controllers/imageController");

const router = express.Router();

router.post(
  "/upload",
  imageC.uploadUserPhoto,
  imageC.resizeUserPhoto,
  imageC.updateMe
);

module.exports = router;
