const express = require("express");
const router = express.Router();

router.get("/", notLoggedIn, (req, res) => {
  res.render("index");
});
module.exports = router;
function notLoggedIn(req, res, next) {
  if (req.session.admin != undefined) {
    res.redirect("/admin/admin-dashboard");
  } else if (req.session.student != undefined) {
    res.redirect("/user/student-dashboard");
  } else if (req.session.teacher != undefined) {
    res.redirect("/teacher/teacher-dashboard");
  } else {
    return next();
  }
}
