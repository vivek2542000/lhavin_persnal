const express = require("express");
var passport = require("passport");
const path = require("path");
const fs = require("fs");
//const auth = require("../public/user");
const catchAsync = require("../../public/utils/catchAsync");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../../public/utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user.jpeg`;
  // console.log(req);
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/pics/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);

  // 1) Create error if user POSTs password data

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  // const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
  //   new: true,
  //   runValidators: true,
  // });

  res.status(200).json({
    status: "success",
  });
});
