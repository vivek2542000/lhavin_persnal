const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Email = require("./../utils/email");

// router.get("/", (req, res, next) => {
//   //homepage
//   db.query("SELECT * FROM user", (err, rows, fields) => {
//     // if (!err) {
//     //   res.send(rows);
//     // } else console.log(err);
//     console.log(rows);
//     res.render("login", { rows });
//   });
// });
exports.isLoggedIn = async (req, res, next) => {};
