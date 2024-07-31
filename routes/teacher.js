/* global localStorage */
const express = require("express");
const request = require("request");
const url = require("url");
var passport = require("passport");
const sendEmail = require(".././public/utils/email");
const imageController = require(".././public/controllers/imageController");
const path = require("path");
const fs = require("fs");
// const mime = require("mime");
const mime = require("mime-types");
const catchAsync = require("../public/utils/catchAsync");
const router = express.Router();
const teacherValidation = require("../public/validation/teacher");
const standardDate = require("../public/otherFunctions/standardDate");
let cronJob = require("cron").CronJob;
const AppError = require("../public/utils/appError");
const { isBoolean, isNullOrUndefined, isUndefined } = require("util");
const https = require("https");

///////////// REST API   //////////////
router.get("/all_teacher_email", function (req, res) {
  let query = `select * from teacher`;
  pool.query(query, function (err, result) {
    if (err) throw err;
    // console.log(result);
    res.json(result);
  });
});
///////////// REST API   //////////////

router.get("/teacher-sign-up", function (req, res) {
  var messages = req.flash("error");
  db.query(`SELECT * from school where isActive = 'active'`, (error, rows) => {
    rows.sort((a, b) => (a.schoolName > b.schoolName ? 1 : -1));
    res.render("teacher/teacher-sign-up", {
      layout: "",
      rows,
      message: req.flash("message"),
      messages: messages,
      hasErrors: messages.length > 0,
    });
  });
});

router.post("/teacher-sign-up", (req, res) => {
  let validationResult = teacherValidation.Signup(req.body);
  if (validationResult == false) {
    let role = "teacher";
    try {
      var findquery =
        "SELECT s.*,t.* FROM student AS s,teacher AS t WHERE s.email=? OR t.email=?";
      db.query(
        findquery,
        [req.body.email, req.body.email],
        (error, results) => {
          if (results.length > 0) {
            req.flash("message", "Email already Exists");
            res.redirect("/teacher/teacher-sign-up");
          } else {
            let create_time = standardDate.date();
            var insertQuery =
              "INSERT INTO teacher (firstname,lastname,email, password,schoolid,JudaicName,JudaicEmail,workbooks,books,role,create_time) values (?, ?, ?, ?, ?, ?,?,?,?,?,?)";

            const booksArray = Array.isArray(req.body.books)
              ? req.body.books
              : [req.body.books];
            db.query(
              insertQuery,
              [
                req.body.firstname,
                req.body.lastname,
                req.body.email,
                req.body.password,
                req.body.schoolid,
                req.body.JudaicName,
                req.body.JudaicEmail,
                req.body.workbooks,
                booksArray.toString(),
                role,
                create_time,
              ],
              (error) => {
                if (error) {
                  req.flash(
                    "message",
                    "Database connection lost assign INSERT INTO teacher"
                  );
                  res.redirect("/");
                  return console.log(error);
                }
                const message = `<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=euc-jp">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Teacher Registration</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <style>
        html,
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: #fff!important;
            margin: 0 auto !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            color:#888!important;
        }
        
        .email-container{
            border-radius: 20px;
            border-top: 4px solid #6B0e3d;
            border-left: 3px solid #6B0e3d;
            border-right: 3px solid #6B0e3d;
            border-bottom: 4px solid #6B0e3d;
                max-width: 600px!important;
                margin: 10px auto!important;
            }
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }
        
        div[style*="margin: 16px 0"] {
            margin: 0 !important;
        }
        table,
        td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }
        
        table { width: 100%;
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
        }
        
        img {
            -ms-interpolation-mode:bicubic;
        }
        
        a {
            text-decoration: none!important;
        }
        
        *[x-apple-data-detectors],  
        .unstyle-auto-detected-links *,
        .aBn {
            border-bottom: 0 !important;
            cursor: default !important;
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
            u ~ div .email-container {
                min-width: 320px !important;
            }
        
        }
        
        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
            u ~ div .email-container {
                min-width: 375px !important;
            }
        }
        
        
        @media only screen and (min-device-width: 414px) {
            u ~ div .email-container {
                min-width: 414px !important;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <table style="border-bottom: 2px solid  #6B0e3d;background-color: #6B0e3d;border-top-left-radius: 15px;border-top-right-radius: 15px; ">
            <tr><td align="center">
                    <img src="https://lhavin.com/images/logo-new.jpg" style="width: 163px; height: 94px; padding-top: 18px;">
                </td></tr>
          

        </table>
        <table style="color: #000;font-size: 16px; text-align:justify;">
            <tr>
                <td style="padding: 11px 17px; ">Dear ${req.body.firstname},</td>  
            </tr>
            <tr>
                <td style="padding: 4px 17px;">Thank you for registering for access to the digital L havin Ulehaskil project. If you are a teacher at a participating school, you will be assigned the workbooks that are intended for your classes.</td>
            </tr>
            <tr>
                <td style="padding: 9px 17px; ">We wish you much Hatzlacha in educating your students, and we hope that our new platform enables you to accomplish this more effectively.</td>
            </tr>

            <tr>
                <td style="padding: 10px 17px; text-align: justify;">Thank you,<br>COJDS</td>
            </tr>
             
        </table>
                  <table style="background-color: #6b0e3d; color: white; font-size:18px;border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;">
         
        </table>
    </div>
</body>

                                  </html>`;
                try {
                  sendEmail({
                    email: req.body.email,
                    subject: `Hi, Thank you for registering`,
                    message: message,
                  });
                } catch (e) {
                  console.log(e);
                }
                req.flash(
                  "message",
                  `You have Successfully Signed Up! You will be able to login once your Account is Activated!
              Please allow 24-48 hours for account activation
              Thank you for submitting this form. Wishing you much success in your classroom!
              `
                );
                res.redirect("/user/login");
              }
            );
          }
        }
      );
    } catch (error) {
      req.flash("message", "Syntax Error");
      res.redirect("/");
      console.log(error);
    }
  } else {
    req.flash("message", validationResult);
    res.redirect("/teacher/teacher-sign-up");
  }
});

router.get("/login", notLoggedIn, function (req, res) {
  var messages = req.flash("error");
  res.render("teacher/teacher-login", {
    layout: "",
    message: req.flash("message"),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post(
  "/login-teacher",
  notLoggedIn,
  passport.authenticate("local-login", {
    failureFlash: true,
    failureRedirect: "/teacher/teacher-dashboard",
    successRedirect: "/teacher/teacher-dashboard",
  }),
  isLoggedIn,
  function (req, res) {
    if (req.body.remember) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30;
    } else {
      req.session.cookie.expires = false;
    }

    if (req.session.teacher.role === "teacher") {
      res.redirect("/teacher/teacher-dashboard");
    } else {
      res.redirect("/teacher/teacher-dashboard");
    }
  }
);

router.post(
  "/forgot-password",

  catchAsync(async function (req, res, next) {
    let userdata;
    var messages = req.flash("error");
    await db.query(
      "SELECT * FROM teacher WHERE email = ?",
      [req.body.email],
      catchAsync(async function (err, rows, next) {
        console.log(err);
        let resettoken = rows[0].id;
        const resetUrl = `https://lhavin.com/teacher/resetPassword/${resettoken}`;

        const message = `<p>We have recieved a request to have your password reset for <b>Jewesh</b>. If you did not make this request, please ignore this email.  <br>
      <br> To reset your password, please <a href = "${resetUrl}"> <b>Visit this link</b> </a> </p> <hr>
      <h3> <b>Having Trouble? </b> </h3>
      <p>If the above link does not work try copying this link into your browser. </p>
      <p>${resetUrl}</p>  <hr>
      <h3><b> Questions? <b> </h3>
      <p>Please let us know if there's anything we can help you with by replying to this email or by emailing <b>support@jewesh.com</b></p>
      `;

        try {
          await sendEmail({
            email: req.body.email,
            subject: `Hi, forgot password? Reset here`,
            message,
          });
          req.flash("message", "Password Reset link Sent Successfully");
          res.redirect("/user/login"); //flash msg remaining
        } catch (err) {
          console.log(err);
        }
      })
    );
  })
);

router.get(
  "/resetPassword/:id",
  catchAsync(async function (req, res) {
    res.render("teacher/reset-password", { layout: "", id: req.params.id });
  })
);

router.get(
  "/get-class-list",
  isLoggedIn,

  catchAsync(async (req, res) => {
    try {
      db.query(
        `SELECT * FROM class where schoolid=?`,
        [req.session.teacher.schoolid],
        (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost schoolid");
            res.redirect("/");
            return console.log(error);
          }
          res.json(rows);
        }
      );
    } catch (error) {
      req.flash("message", "syntax Error");
      res.redirect("/");
      console.log(error);
    }
  })
);

router.post(
  "/resetPassword/:id",
  catchAsync(async function (req, res) {
    let updatedata = "UPDATE teacher SET password =? WHERE id =?";
    let data = [req.body.newpassword, req.params.id];
    db.query(updatedata, data, (error) => {
      if (error) {
        req.flash("message", "Database connection lost teacher");
        res.redirect("/");
        return console.error(error.message);
      }
      req.flash("message", "Password Updated Successfully");
      res.redirect("/user/login");
    });
  })
);

router.get("/teacher-change-password", isLoggedIn, function (req, res, next) {
  //login
  let active;
  if (req.url === "/teacher-change-password") {
    active = "active";
  } else active = "";
  res.render("teacher/teacher-change-password", {
    title: "Teacher|Dashboard",
    layout: "layoutteacher.hbs",
    activechangepassword: active,
    errormessage: req.flash("errormessage"),
    message: req.flash("message"),
    username:
      req.session.teacher.firstname + " " + req.session.teacher.lastname,
    user: req.session.teacher,
    imagePath: req.session.teacher.imagePath,
  });
});

router.post(
  "/teacher-change-password",
  isLoggedIn,
  catchAsync(async function (req, res, next) {
    try {
      let oldpassword = req.body.oldpassword;
      let newpassword = req.body.newpassword;
      let confirmpassword = req.body.confirmpassword;
      let finduser = "SELECT * FROM teacher WHERE id =?";
      let data = req.session.teacher.id;
      await db.query(finduser, data, async (error, rows, fields) => {
        if (error) {
          req.flash("message", "Database connection lost teacher");
          res.redirect("/");
          return console.error(error.message);
        }
        if (oldpassword != rows[0].password) {
          var messages = req.flash("error");
          req.flash("errormessage", "Old Password is incorrect");
          res.redirect("/teacher/teacher-change-password");
        } else {
          let updateuser = "UPDATE teacher SET password =? WHERE id =?";
          let updatedata = [newpassword, req.session.teacher.id];
          await db.query(updateuser, updatedata, (error, results, fields) => {
            if (error) {
              req.flash("message", "Database connection lost teacher");
              res.redirect("/");
              return console.error(error.message);
            }
            req.flash("message", "Password Updated");
            res.redirect("/teacher/teacher-change-password");
          });
        }
      });
    } catch (error) {
      req.flash("message", "syntax Error");
      res.redirect("/");
      console.log(error);
    }
  })
);

router.use("/login", notLoggedIn, function (req, res, next) {
  next();
});

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

router.all("*", function (req, res, next) {
  if (req.session.teacher == undefined) {
    res.redirect("/user/login");
  } else {
    next();
  }
});

router.get("/teacher-dashboard", isLoggedIn, function (req, res) {
  let totalstudents;
  let totalpdfs;
  let recentAssignedPdf;
  let active;
  if (req.url === "/teacher-dashboard") {
    active = "active";
  } else active = "";
  try {
    db.query(
      `SELECT * FROM student WHERE schoolid = ${req.session.teacher.schoolid}`,
      (error, rows) => {
        if (error) {
          req.flash("message", "Database connection lost student");
          res.redirect("/teacher-edit-profile");
          return console.log(error);
        }
        totalstudents = rows && rows.length;

        db.query(
          `SELECT ap.* FROM assignPdf AS ap WHERE ap.assignTo=${req.session.teacher.id}`,
          (error, rows) => {
            if (error) {
              req.flash("message", "Database connection lost assignPdf");
              res.redirect("/teacher-edit-profile");
              return console.log(error);
            }
            totalpdfs = rows && rows.length;

            db.query(
              `SELECT s.*,p.*,ap.*,(SELECT teacher.firstname FROM teacher WHERE teacher.id =${req.session.teacher.id} ) AS teacher_name FROM assignPdf AS ap ,student AS s , pdf AS p WHERE s.id = ap.assignToStudent AND p.pdfid = ap.pdfid AND ap.assignFrom=? order BY ap.assignid DESC LIMIT 5`,
              [req.session.teacher.id],
              (error, rows) => {
                if (error) {
                  req.flash("message", "Database connection lost teacher");
                  res.redirect("/teacher-edit-profile");
                  return console.log(error);
                }
                recentAssignedPdf = rows;
                res.render("teacher/teacher-dashboard", {
                  layout: "layoutteacher.hbs",
                  message: req.flash("message "),
                  activedashboard: active,
                  totalstudents,
                  totalpdfs,
                  recentAssignedPdf,
                  imagePath: req.session.teacher.imagePath,
                  username:
                    req.session.teacher.firstname +
                    " " +
                    req.session.teacher.lastname,
                  user: req.session.teacher,
                  lastlogintime: req.session.teacher.lastlogintime,
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    req.flash("message", "syntax Error");
    res.redirect("/teacher-edit-profile");
    console.log(error);
  }
});

router.get("/teacher-view-pdf", (req, res) => {
  let active = "active";
  let pdfurl = req.query.pdf;
  res.render("teacher/PdfView", {
    layout: "layoutteacher.hbs",
    pdfurl,
    activedashboard: active,
    username:
      req.session.teacher.firstname + " " + req.session.teacher.lastname,
    imagePath: req.session.teacher.imagePath,
    user: req.session.teacher,
  });
});

router.get("/teacher-assigned-view-pdf", (req, res) => {
  let active = "active";
  let pdfurl1 = req.query.pdf;
  let pdfurl = pdfurl1.toString();
  res.render("teacher/PdfView", {
    layout: "layoutteacher.hbs",
    pdfurl,
    activeassignedbyadmin: active,
    username:
      req.session.teacher.firstname + " " + req.session.teacher.lastname,
    imagePath: req.session.teacher.imagePath,
    user: req.session.teacher,
  });
});

router.get("/teacher-assigned-student-view-pdf", (req, res) => {
  let active = "active";
  let pdfurl1 = req.query.pdf;
  let pdfurl = pdfurl1.toString();
  res.render("teacher/viewPdff1", {
    layout: "layoutteacher.hbs",
    pdfurl,
    activeassignedtostudent: active,
    username:
      req.session.teacher.firstname + " " + req.session.teacher.lastname,
    imagePath: req.session.teacher.imagePath,
    user: req.session.teacher,
  });
});

router.get("/teacher-assigned-student-completed-view-pdf", (req, res) => {
  let active = "active";
  let pdfurl = req.query.pdf;
  res.render("teacher/PdfView", {
    layout: "layoutteacher.hbs",
    pdfurl,
    activedashboard: active,
    username:
      req.session.teacher.firstname + " " + req.session.teacher.lastname,
    imagePath: req.session.teacher.imagePath,
    user: req.session.teacher,
  });
});

router.get("/teacher-assigned-log-view-pdf", (req, res) => {
  let active = "active";
  let pdfurl = req.query.pdf;
  res.render("teacher/PdfView", {
    layout: "layoutteacher.hbs",
    pdfurl,
    activedashboard: active,
    username:
      req.session.teacher.firstname + " " + req.session.teacher.lastname,
    imagePath: req.session.teacher.imagePath,
    user: req.session.teacher,
  });
});

router.get("/teacher-assigned-student-total-assigned-view-pdf", (req, res) => {
  let active = "active";
  let pdfurl = req.query.pdf;
  res.render("teacher/PdfView", {
    layout: "layoutteacher.hbs",
    pdfurl,
    activemystudents: active,
    username:
      req.session.teacher.firstname + " " + req.session.teacher.lastname,
    imagePath: req.session.teacher.imagePath,
    user: req.session.teacher,
  });
});

router.post("/teacher-dashboard-view-pdf", isLoggedIn, (req, res) => {
  let active = "active";
  let pdfurl = req.body.pdfurl;
  res.render("teacher/viewPdff1", {
    layout: "layoutteacher.hbs",
    pdfurl: pdfurl,
    activedashboard: active,
    username:
      req.session.teacher.firstname + " " + req.session.teacher.lastname,
    imagePath: req.session.teacher.imagePath,
  });
});

router.post("/teacher-assigned-view-pdf", isLoggedIn, (req, res) => {
  let active = "active";
  let pdfurl1 = req.body.pdfurl;
  let pdfurl = pdfurl1?.toString();

  res.render("teacher/viewPdff1", {
    layout: "layoutteacher.hbs",
    pdfurl: pdfurl,
    activeassignedbyadmin: active,
    username:
      req.session.teacher.firstname + " " + req.session.teacher.lastname,
    imagePath: req.session.teacher.imagePath,
  });
});

router.post("/teacher-assigned-student-view-pdf", isLoggedIn, (req, res) => {
  let active = "active";

  let pdfurl = req.body.pdfurl;

  if (req.body.pdfurl) {
    res.render("teacher/viewPdff1", {
      layout: "layoutteacher.hbs",
      pdfurl: pdfurl,
      activeassignedtostudent: active,
      username:
        req.session.teacher.firstname + " " + req.session.teacher.lastname,
      imagePath: req.session.teacher.imagePath,
    });
  } else {
    req.flash("message", "Student has not started working on this pdf");
    res.redirect("/teacher/assigned-to-student");
  }
});

router.post(
  "/teacher-assigned-student-total-view-pdf",
  isLoggedIn,
  (req, res) => {
    let active = "active";
    let pdfurl = req.body.pdfurl;
    if (req.body.pdfurl) {
      res.render("teacher/viewPdff1", {
        layout: "layoutteacher.hbs",
        pdfurl: pdfurl,
        activemystudents: active,
        username:
          req.session.teacher.firstname + " " + req.session.teacher.lastname,
        imagePath: req.session.teacher.imagePath,
      });
    } else {
      req.flash("message", "Student has not started working on this pdf");
      res.redirect("/teacher/my-students");
    }
  }
);

router.post("/upload", isLoggedIn, (req, res) => {
  try {
    var selectedfile = req.files.photo.data;
    let returnedB64 = Buffer.from(selectedfile).toString("base64");
    const url1 = "https://lhavin.com";
    var matches = returnedB64;
    response = {};
    response.type = matches;
    response.data = new Buffer.from(matches, "base64");
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    const name = type.split("/");
    // const name1 = name[0];
    extension = mime.extension(type);
    const rand = Math.ceil(Math.random() * 1000);
    const filenameOriginal = `${req.session.teacher.firstname}.${req.files.photo.name}`;
    const remsp = filenameOriginal.split(" ").join("_");
    const fileName = remsp;
    path3 = path.resolve(`./public/userImages`);

    let localpath = `${path3}/`;

    if (!fs.existsSync(localpath)) {
      fs.mkdirSync(localpath);
    }

    fs.writeFileSync(`${localpath}` + fileName, imageBuffer, "utf8");
    ip = url1; // 'cuboidtechnologies.com';
    const url = `${ip}/userImages/${fileName}`;

    let getdata = "UPDATE teacher SET imagePath=? WHERE id=?";
    let dataid = [url, req.session.teacher.id];

    db.query(getdata, dataid, (error, results, fields) => {
      if (error) {
        req.flash("message", "Database connection lost UPDATE teacher");
        res.redirect("/");
        return console.error(error.message);
      }
      req.session.teacher.imagePath = url;
      req.flash("message", "Image uploaded Successfully");
      res.redirect("/teacher/teacher-edit-profile");
    });
  } catch (error) {
    console.log(error);
    // req.flash("message", "syntax error");
    // res.redirect("/");
  }
});

router.get("/teacher-edit-profile", isLoggedIn, function (req, res) {
  try {
    let active;
    if (req.url === "/teacher-edit-profile") {
      active = "active";
    } else active = "";
    db.query(
      "SELECT t.*,s.* FROM teacher AS t,school AS s WHERE t.id = ? AND t.schoolid = s.id",
      [req.session.teacher.id],
      function (err, rows) {
        if (err) {
          req.flash("message", "Database connection lost teacher");
          res.redirect("/");
        } else {
          let rowsdata = rows;
          db.query("SELECT * FROM school", (error, rows) => {
            let schoolnames = rows;
            res.render("teacher/teacher-edit-profile", {
              layout: "layoutteacher.hbs",
              activeeditprofile: active,
              message: req.flash("message"),
              failed: req.flash("failed"),
              schoolnames,
              username:
                req.session.teacher.firstname +
                " " +
                req.session.teacher.lastname,
              user: req.session.teacher,
              rows: rowsdata,
              imagePath: req.session.teacher.imagePath,
            });
          });
        }
      }
    );
  } catch (error) {
    req.flash("message", "syntax error");
    res.redirect("/");
    console.log(error);
  }
});

router.post("/teacher-edit-profile", isLoggedIn, function (req, res) {
  try {
    if (req.body.oldemail == req.body.email) {
      let updatedata =
        "UPDATE teacher SET firstname =?, lastname= ?, email =?, schoolid =?,JudaicName =?,JudaicEmail =?,workbooks =?,books =? WHERE id =?";
      const booksArray = Array.isArray(req.body.books) ? req.body.books : [];
      let data = [
        req.body.firstname,
        req.body.lastname,
        req.body.email,
        req.body.schoolid,
        req.body.JudaicName,
        req.body.JudaicEmail,
        req.body.workbooks,
        booksArray.toString(),
        req.session.teacher.id,
      ];
      db.query(updatedata, data, (error, results, fields) => {
        if (error) {
          req.flash("message", "Database connection lost teacher");
          res.redirect("/");
          return console.error(error.message);
        }
        db.query(
          "SELECT * FROM teacher WHERE id =?",
          [req.session.teacher.id],
          (err, rows, fields) => {
            if (err) {
              req.flash("message", "Database connection lost teacher");
              res.redirect("/");
              console.log(err);
            }
            if (rows && rows.length > 0) {
              req.session.teacher = rows[0];
            }
            req.flash("message", "Profile Updated Successfully");
            res.redirect("/teacher/teacher-edit-profile");
          }
        );
      });
    } else {
      db.query(
        `SELECT t.*,s.* FROM teacher AS t,student AS s where s.email = "${req.body.email}" or t.email = "${req.body.email}"`,
        (err, rows, fields) => {
          if (err) {
            req.flash("message", "Database connection lost teacher");
            res.redirect("/");
            console.log(err);
          }
          let inactive = "inactive";
          if (rows && rows.length > 0) {
            req.flash("failed", "Email already exist");
            res.redirect("/teacher/teacher-edit-profile");
          } else {
            //let data = ["student"];

            let updatedata =
              "UPDATE teacher SET firstname =?, lastname= ?, email =?, schoolid =? ,JudaicName =?,JudaicEmail =?,workbooks =?,books =? WHERE id =?";
            let data = [
              req.body.firstname,
              req.body.lastname,
              req.body.email,
              req.body.schoolid,
              req.body.JudaicName,
              req.body.JudaicEmail,
              req.body.workbooks,
              req.body.books.toString(),
              req.session.teacher.id,
            ];
            db.query(updatedata, data, (error, results, fields) => {
              if (error) {
                req.flash("message", "Database connection lost teacher");
                res.redirect("/");
                return console.error(error.message);
              }
              db.query(
                "SELECT * FROM teacher WHERE id =?",
                [req.session.teacher.id],
                (err, rows, fields) => {
                  if (err) {
                    req.flash("message", "Database connection lost teacher");
                    res.redirect("/");
                    console.log(err);
                  }
                  if (rows && rows.length > 0) {
                    req.session.teacher = rows[0];
                  }
                  req.flash("message", "Profile Updated Successfully");
                  res.redirect("/teacher/teacher-edit-profile");
                }
              );
            });
          }
        }
      );
    }
  } catch (error) {
    req.flash("message", "syntax error");
    res.redirect("/");
    console.log(error);
  }
});

router.get("/assigned-by-admin", isLoggedIn, function (req, res) {
  //login
  try {
    let active;
    if (req.url === "/assigned-by-admin") {
      active = "active";
    } else active = "";
    db.query(
      "SELECT t.*,p.*,ap.* FROM `assignPdf` AS ap ,`teacher` AS t , `pdf` AS p WHERE t.id = ap.assignTo AND p.pdfid = ap.pdfid AND t.id=? ORDER BY ap.assignid desc",
      [req.session.teacher.id],
      (error, rows) => {
        if (error) {
          req.flash("message", "Database connection lost assignPdf");
          res.redirect("/");
          return console.log(error);
        }

        res.render("teacher/assigned-by-admin", {
          layout: "layoutteacher.hbs",
          rows: rows,
          activeassignedbyadmin: active,
          message: req.flash("message"),
          username:
            req.session.teacher.firstname + " " + req.session.teacher.lastname,
          user: req.session.teacher,
          imagePath: req.session.teacher.imagePath,
        });
      }
    );
  } catch (error) {
    req.flash("message", "syntax error");
    res.redirect("/");
    console.log(error);
  }
});

router.post("/viewPdf/:id", isLoggedIn, (req, res) => {
  try {
    db.query(
      `SELECT * from kamiKeyManagement WHERE id =?`,
      [1],
      (error, rows) => {
        let kamikey = rows[0].kamiKey;
        let count = 0;
        let docid = "";
        activeassignedbyadmin = "active";
        let currentassignid = req.body.assignid;
        let pdfid = req.params.id;
        lastedit = standardDate.date();
        db.query(
          "UPDATE pdf t1, assignPdf t2 SET  t2.lasteditByTeacher=? WHERE t1.pdfid = t2.pdfid AND t2.assignid=?",
          [lastedit, currentassignid],
          (error, rows) => {
            if (error) {
              req.flash("message", "Database connection lost assignPdf");
              res.redirect("/");
              return console.log(error);
            }

            db.query(
              `INSERT INTO pdfEditHistoryByMember (assignPdf_id,pdfid, member,memberid,date,time,status) values (?,?,?,?,?,?,?)`,
              [
                currentassignid,
                pdfid,
                "teacher",
                req.session.teacher.id,
                lastedit.split(" ")[0],
                lastedit.split(" ")[1],
                "Edit",
              ],
              (error, rows) => {
                if (error) {
                  return console.log("error", error);
                }
                db.query(
                  "SELECT * FROM pdf WHERE pdfid=?",
                  [req.params.id],
                  (error, rows) => {
                    let data = rows;
                    pdfurl = data[0].pdfurl;
                    pdfname = data[0].pdfname;
                    //do it

                    db.query(
                      "SELECT * FROM assignPdf WHERE assignid=?",
                      [currentassignid],
                      (error, rows) => {
                        let kpdfurl = rows[0].editPdfOfTeacher;
                        let pdfcount = rows[0].TCOUNT;
                        if (pdfcount === 0) {
                          request.post(
                            "https://api.notablepdf.com/embed/documents",
                            {
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Token ${kamikey}`,
                              },
                              body: {
                                document_url: pdfurl,
                                name: pdfname,
                              },
                              json: true,
                            },
                            catchAsync(async function (
                              error,
                              response,
                              body,
                              next
                            ) {
                              docid = body.document_identifier;
                              await db.query(
                                "UPDATE `assignPdf` SET `documentIdentifierTeacher`=? WHERE assignid=?",
                                [docid, currentassignid],
                                (error, rows) => {
                                  if (error) {
                                    req.flash(
                                      "message",
                                      "Database connection lost assignPdf"
                                    );
                                    res.redirect("/");
                                    return console.log(error);
                                  }
                                }
                              );

                              request.post(
                                "https://api.notablepdf.com/embed/sessions",
                                {
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Token ${kamikey}`,
                                  },
                                  body: {
                                    document_identifier: docid,
                                    user: {
                                      name: req.session.teacher.firstname,
                                      user_id: req.session.teacher.id,
                                    },
                                    viewer_options: {
                                      theme: "light",
                                      show_save: false,
                                      show_print: false,
                                      show_help: false,
                                      show_menu: false,
                                      tool_visibility: {
                                        normal: true,
                                        highlight: true,
                                        strikethrough: true,
                                        underline: true,
                                        comment: true,
                                        text: true,
                                        equation: true,
                                        drawing: true,
                                        shape: true,
                                        eraser: true,
                                        image: true,
                                        autograph: false,
                                        tts: false,
                                      },
                                    },
                                    editable: true,
                                  },
                                  json: true,
                                },
                                catchAsync(async function (
                                  error,
                                  response,
                                  body
                                ) {
                                  let docurl = body.viewer_url;
                                  db.query(
                                    "UPDATE `assignPdf` SET `editPdfOfTeacher`=?, `TCOUNT`=? WHERE assignid=?",
                                    [docurl, 1, currentassignid],
                                    (error, rows) => {
                                      if (error) {
                                        req.flash(
                                          "message",
                                          "Database connection lost assignPdf"
                                        );
                                        res.redirect("/");
                                        return console.log(error);
                                      }

                                      res.render("teacher/viewPdf", {
                                        layout: "layoutteacher.hbs",
                                        docurl,
                                        activeassignedbyadmin,
                                        currentassignid,
                                        pdfid,
                                        username:
                                          req.session.teacher.firstname +
                                          " " +
                                          req.session.teacher.lastname,
                                        user: req.session.teacher,
                                        imagePath:
                                          req.session.teacher.imagePath,
                                      });
                                    }
                                  );
                                })
                              );
                            })
                          );
                        } else {
                          res.render("teacher/viewPdf", {
                            layout: "layoutteacher.hbs",
                            kpdfurl: kpdfurl,
                            activeassignedbyadmin,
                            currentassignid,
                            username:
                              req.session.teacher.firstname +
                              " " +
                              req.session.teacher.lastname,
                            user: req.session.teacher,
                            imagePath: req.session.teacher.imagePath,
                            pdfid,
                          });
                        }
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// this api is only to create new session and remove existing session please run with caution
//all the previous session will be deleted after this
router.get("/create-new-session-of-all-assigned-pdf", (req, res) => {
  try {
    db.query(
      `SELECT * from kamiKeyManagement WHERE id =?`,
      [1],
      (error, rows) => {
        let kamikey = rows[0].kamiKey;
        db.query(
          "SELECT t.*,p.*,ap.* FROM `assignPdf` AS ap ,`teacher` AS t , `pdf` AS p WHERE t.id = ap.assignTo AND p.pdfid = ap.pdfid",
          (error, rows) => {
            for (let i = 0; i < rows.length; i++) {
              const currentRow = rows[i];
              const newPdfUrl = rows[i].pdfOfTeacher || rows[i].pdfurl;
              let newPdfName = newPdfUrl.split("/");
              newPdfName = newPdfName[newPdfName.length - 1];
              request.post(
                "https://api.notablepdf.com/embed/documents",
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${kamikey}`,
                  },
                  body: {
                    document_url: newPdfUrl,
                    name: newPdfName,
                  },
                  json: true,
                },
                catchAsync(async function (error, response, body, next) {
                  if (error) {
                    req.flash("message", "Database connection lost assignPdf");
                    res.redirect("/");
                    console.log(error);
                  } else {
                    const docid = body.document_identifier;
                    const docRes = body;
                    const assignId = rows[i].assignid;
                    await db.query(
                      "UPDATE `assignPdf` SET `documentIdentifierTeacher`=? WHERE assignid=?",
                      [docid, assignId],
                      (error, rows) => {
                        if (error) {
                          req.flash(
                            "message",
                            "Database connection lost assignPdf"
                          );
                          res.redirect("/");
                          return console.log("update", error);
                        }
                      }
                    );
                    await db.query(
                      "SELECT firstname, id FROM teacher where id=?",
                      [rows[i].assignTo],
                      (rows) => {
                        const currentTeacher = rows[0];
                        request.post(
                          "https://api.notablepdf.com/embed/sessions",
                          {
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Token ${kamikey}`,
                            },
                            body: {
                              document_identifier: docid,
                              user: {
                                name: currentTeacher.firstname,
                                user_id: currentTeacher.id,
                              },
                              // expires_at: "2021-10-20T05:01:00.0Z",
                              viewer_options: {
                                theme: "light",
                                show_save: false,
                                show_print: false,
                                show_help: false,
                                show_menu: false,
                                tool_visibility: {
                                  normal: true,
                                  highlight: true,
                                  strikethrough: true,
                                  underline: true,
                                  comment: true,
                                  text: true,
                                  equation: true,
                                  drawing: true,
                                  shape: true,
                                  eraser: true,
                                  image: true,
                                  autograph: false,
                                  tts: false,
                                },
                              },
                              editable: true,
                            },
                            json: true,
                          },
                          catchAsync(async function (
                            error,
                            response,
                            body,
                            next
                          ) {
                            if (!error) {
                              // currentRow.pdfid == 444
                              if (
                                currentRow.assignTo == 39 &&
                                currentRow.pdfid == 514
                              )
                                db.query(
                                  "UPDATE `assignPdf` SET `editPdfOfTeacher`=? WHERE assignid=?",
                                  [body.viewer_url, assignId]
                                );
                            } else {
                              console.log("LAST: ", error);
                            }
                          })
                        );
                      }
                    );
                  }
                })
              );
            }
            res.json({ rows: rows.length });
          }
        );
      }
    );
  } catch (error) {
    req.flash("message", "syntax error");
    res.redirect("/");
    console.log(error);
  }
});

router.get("/editting-history/:id", isLoggedIn, (req, res) => {
  try {
    let count = 0;
    let docid = "";
    activeassignedbyadmin = "active";
    let currentassignid = req.session.assignid;
    req.session.assignid = undefined;
    let pdfid = req.params.id;
    lastedit = standardDate.date();

    if (currentassignid) {
      db.query(
        `SELECT ap.*,p.* FROM assignPdf AS ap,pdf AS p WHERE ap.assignid = ${currentassignid} AND p.pdfid = ${pdfid}`,
        (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost assignPdf");
            res.redirect("/");
            return console.log("error", error);
          }
          let assignPdf = rows[0];

          db.query(
            `SELECT p.*,peh.*,ap.*,t.firstname,t.lastname FROM pdf AS p, pdfEditHistoryByMember AS peh,assignPdf AS ap,teacher AS t WHERE peh.assignPdf_id = "${currentassignid}" AND p.pdfid = peh.pdfid AND ap.assignid = peh.assignPdf_id AND peh.memberid = t.id`,
            (error, rows) => {
              if (error) {
                req.flash("message", "Database connection lost pdf");
                res.redirect("/");
                return console.log("error", error);
              }
              res.render("teacher/editting-history", {
                layout: "layoutteacher.hbs",
                edit_history: rows,
                assignPdf,
                editted_by:
                  req.session.teacher.firstname +
                  " " +
                  req.session.teacher.lastname,
                username:
                  req.session.teacher.firstname +
                  " " +
                  req.session.teacher.lastname,
                imagePath: req.session.teacher.imagePath,
              });
            }
          );
        }
      );
    } else {
      res.redirect("/teacher/assigned-by-admin");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/editting-history/:id", isLoggedIn, (req, res) => {
  req.session.assignid = req.body.assignid;
  res.redirect(`/teacher/editting-history/${req.params.id}`);
});

router.post("/pdf-status-update", isLoggedIn, async (req, res) => {
  try {
    let docid;
    lastedit = standardDate.date();
    let currentassignid = req.body.currentassignid;
    let pdfid = req.body.pdfid;
    db.query(`SELECT * FROM kamikeymanagement WHERE id=1`, (error, rows) => {
      if (!rows || !rows[0].kamiKey) {
        req.flash(
          "message",
          "Invalid data from the database teacher js line no 1313"
        );
        return res.redirect("/");
      }
      console.log("this project is shit: ", error);
      let kamikey = rows[0].kamiKey;

      db.query(
        "select * from assignPdf WHERE assignid=?",
        currentassignid,
        (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost assignPdf");
            res.redirect("/");
            return console.log(error);
          }
          request.post(
            "https://api.notablepdf.com/embed/exports",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${kamikey}`,
              },
              body: {
                document_identifier: rows[0].documentIdentifierTeacher,
                export_type: "inline",
              },
              json: true,
            },
            catchAsync(async function (error, response, body, next) {
              docid = body.id;
              request.get(
                `https://api.notablepdf.com/embed/exports/${docid}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${kamikey}`,
                  },
                },
                catchAsync(async function (error, response, body, next) {
                  let bodydata = JSON.parse(body);
                  let docurl = bodydata.file_url;
                  let n = 1;
                  //'0 * * * * *' - runs every minute
                  let myJob = new cronJob("* * * * * *", async function () {
                    request.get(
                      `https://api.notablepdf.com/embed/exports/${docid}`,
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Token ${kamikey}`,
                        },
                      },
                      catchAsync(async function (error, response, body, next) {
                        let bodydata = JSON.parse(body);
                        let docurl = bodydata.file_url;
                        let status = bodydata.status;

                        if (status === "done") {
                          const url = bodydata.file_url; // link to file you want to download
                          const path =
                            "./public/pdf/" + `${bodydata.id}` + ".pdf"; // where to save a file

                          const request = https.get(url, function (response) {
                            if (response.statusCode === 200) {
                              var file = fs.createWriteStream(path);
                              response.pipe(file);
                            }
                            request.setTimeout(60000, function () {
                              request.abort();
                            });
                          });

                          let url1 =
                            "https://lhavin.com" +
                            "/pdf/" +
                            `${bodydata.id}` +
                            ".pdf";
                          await db.query(
                            "UPDATE `assignPdf` SET `pdfOfTeacher`=?, `TCOUNT`=?,tpdfstatus = 1, lasteditByTeacher = ? WHERE assignid=?",
                            [url1, 1, lastedit, currentassignid],
                            (error) => {
                              if (error) {
                                req.flash(
                                  "message",
                                  "Database connection lost assignPdf"
                                );
                                res.redirect("/");
                                return console.log(error);
                              }
                              myJob.stop();
                              req.flash(
                                "message",
                                "Pdf Marked as Completed! Now You can Assign it to Students"
                              );
                              res.redirect("/teacher/assigned-by-admin");
                            }
                          );
                        }
                        if (n === 25) {
                          myJob.stop();
                          req.flash("message", "Pdf Completion failed");
                          res.redirect("/teacher/assigned-by-admin");
                        }
                      })
                    );
                  });
                  if (bodydata.file_url === null) {
                    myJob.start();
                  }
                  if (bodydata.status == "done") {
                    const url = bodydata.file_url; // link to file you want to download
                    const path = "./public/pdf/" + `${bodydata.id}` + ".pdf"; // where to save a file

                    const request = https.get(url, function (response) {
                      if (response.statusCode === 200) {
                        var file = fs.createWriteStream(path);
                        response.pipe(file);
                      }
                      request.setTimeout(60000, function () {
                        request.abort();
                      });
                    });

                    let url1 =
                      "https://lhavin.com" +
                      "/pdf/" +
                      `${bodydata.id}` +
                      ".pdf";
                    await db.query(
                      "UPDATE `assignPdf` SET `pdfOfTeacher`=?, `TCOUNT`=?,tpdfstatus = 1, lasteditByTeacher = ? WHERE assignid=?",
                      [url1, 1, lastedit, currentassignid],
                      (error) => {
                        if (error) {
                          req.flash(
                            "message",
                            "Database connection lost assignPdf"
                          );
                          res.redirect("/");
                          return console.log(error);
                        }
                        myJob.stop();
                        req.flash(
                          "message",
                          "Pdf Marked as Completed! Now You can Assign it to Students"
                        );
                        res.redirect("/teacher/assigned-by-admin");
                      }
                    );
                  }
                })
              );
            })
          );
        }
      );
    });
  } catch (error) {
    req.flash("message", "syntax error");
    res.redirect("/");
    console.log(error);
  }
});
let pdf;
let students;
let tablelist;

router.get("/assigned-to-student", isLoggedIn, function (req, res) {
  //login
  try {
    let active;
    if (req.url === "/assigned-to-student") {
      active = "active";
    } else active = "";
    db.query(
      `SELECT t.*,p.*,ap.* FROM teacher AS t, assignPdf AS ap  , pdf AS p WHERE t.id = ap.assignTo AND p.pdfid = ap.pdfid AND t.id = ${req.session.teacher.id} ORDER BY ap.assignid desc`,
      (error, rows) => {
        if (error) {
          req.flash("message", "Database connection lost teacher");
          res.redirect("/");
          return console.log(error);
        } else {
          totalItems = rows && rows.length;
          pdf = rows;
          db.query(
            `SELECT * FROM student AS s WHERE s.schoolid=${req.session.teacher.schoolid} AND s.isActive = "active"`,
            (error, rows) => {
              if (error) {
                req.flash("message", "Database connection lost student");
                res.redirect("/");
                return console.log(error);
              } else {
                students = rows;
                db.query(
                  `SELECT t.*, p.*, ap.* FROM student AS t, assignPdf AS ap, pdf AS p WHERE t.id = ap.assignToStudent AND p.pdfid = ap.pdfid AND ap.assignFrom = ${req.session.teacher.id} ORDER BY ap.assignid desc`,
                  (error, rows) => {
                    if (error) {
                      req.flash(
                        "message",
                        "Database connection lost assignPdf"
                      );
                      res.redirect("/");
                      return console.log(error);
                    }

                    tablelist = rows; // console.log(tablelist);

                    db.query(
                      `SELECT * FROM class where schoolid=?`,
                      [req.session.teacher.schoolid],
                      (error, rows) => {
                        if (error) {
                          req.flash(
                            "message",
                            "Database connection lost schoolid"
                          );
                          res.redirect("/");
                          console.log(error);
                        }
                        let classList = rows;
                        res.render("teacher/assigned-to-student", {
                          layout: "layoutteacher.hbs",
                          activeassignedtostudent: active,
                          pdf: pdf,
                          students: students,
                          tablelist,
                          classList,
                          message: req.flash("message"),
                          username:
                            req.session.teacher.firstname +
                            " " +
                            req.session.teacher.lastname,
                          user: req.session.teacher,
                          imagePath: req.session.teacher.imagePath,
                        });
                      }
                    );
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (error) {
    req.flash("message", "syntax error");
    res.redirect("/");
    console.log(error);
  }
});

router.post(
  "/assign-pdf-to-student",
  isLoggedIn,
  catchAsync(async (req, res) => {
    try {
      if (req.body.studentname) {
        let tkpdfurl = "";
        let lastedit = standardDate.date();
        assign_pdf_function = async (studentname) => {
          studentname = parseInt(studentname);
          db.query(
            "SELECT * FROM assignPdf WHERE assignid=?",
            [req.body.currentassignid],
            (rows) => {
              tkpdfurl = rows[0].pdfOfTeacher;
              pdfid = rows[0].pdfid;
              db.query(
                `INSERT INTO assignPdf (assignByTeacher, assignToStudent , studentDescription, pdfid, pdfForStudent,assignFrom,dateAssignedByTeacher) values (?,?,?,?,?,?,?)`,
                [
                  req.session.teacher.firstname +
                    " " +
                    req.session.teacher.lastname,
                  studentname,
                  req.body.textarea,
                  pdfid,
                  tkpdfurl,
                  req.session.teacher.id,
                  lastedit,
                ],
                (error) => {
                  if (error) {
                    req.flash("message", "Database connection lost assignPdf");
                    res.redirect("/");
                    return console.log("error", error);
                  }

                  db.query(
                    "SELECT * FROM student WHERE id=?",
                    [studentname],
                    async (error) => {
                      if (error) {
                        req.flash(
                          "message",
                          "Database connection lost student"
                        );
                        res.redirect("/");
                        console.log("error", error);
                      }
                      const message = `<p>${
                        req.session.teacher.firstname +
                        " " +
                        req.session.teacher.lastname
                      } has Assigned a PDf to You</p>`;
                    }
                  );
                }
              );
            }
          );
        };

        Array.isArray(req.body.studentname)
          ? req.body.studentname.map((studentname, i) => {
              assign_pdf_function(studentname);
            })
          : assign_pdf_function(req.body.studentname);

        req.flash("message", "PDF assigned");
      } else if (
        req.body.studentname == isNullOrUndefined ||
        req.body.studentname == isUndefined ||
        (req.body.studentname == undefined && req.body.cars != "4")
      ) {
        let tkpdfurl = "";
        let lastedit = standardDate.date();
        await db.query(
          "SELECT * FROM assignPdf WHERE assignid=?",
          [req.body.currentassignid],
          async (rows) => {
            tkpdfurl = rows[0].pdfOfTeacher;
            pdfid = rows[0].pdfid;
            await db.query(
              `SELECT st.*,(SELECT COUNT(*) FROM assignPdf WHERE assignToStudent = st.id) AS TotalAsign,(select schoolName from school where id = st.schoolid) AS school_name,(select className from class where id = st.classid) AS class_name FROM student AS st WHERE st.schoolid = ${req.session.teacher.schoolid} ORDER BY st.id desc`,
              async (error, rows) => {
                if (error) {
                  req.flash("message", "Database connection lost assignPdf");
                  res.redirect("/");
                  console.log("error", error);
                }
                for (i = 0; i < rows.length; i++) {
                  const message = `<p>${
                    req.session.teacher.firstname +
                    " " +
                    req.session.teacher.lastname
                  } has Assigned a PDf to You</p>`;
                  try {
                    await db.query(
                      `INSERT INTO assignPdf (assignByTeacher ,assignToStudent, studentDescription, pdfid, pdfForStudent,assignFrom,dateAssignedByTeacher) values (?,?,?,?,?,?,?)`,
                      [
                        req.session.teacher.firstname +
                          " " +
                          req.session.teacher.lastname,
                        rows[i].id,
                        req.body.textarea,
                        pdfid,
                        tkpdfurl,
                        req.session.teacher.id,
                        lastedit,
                      ]
                    );
                  } catch (err) {
                    req.flash("message", "syntax error");
                    res.redirect("/");
                    console.log(err);
                  }
                }
              }
            );
          }
        );
        req.flash("message", "PDF assigned to all Students");
      } else if (req.body.cars == "4") {
        let tkpdfurl = "";
        let lastedit = standardDate.date();

        if (typeof req.body.classname === "object") {
          db.query(
            "SELECT * FROM assignPdf WHERE assignid=?",
            [req.body.currentassignid],
            (error, rows) => {
              console.log(rows);
              tkpdfurl = rows[0].pdfOfTeacher;
              pdfid = rows[0].pdfid;

              for (var i in req.body.classname) {
                db.query(
                  `SELECT * FROM student where schoolid = ? AND classid =?`,
                  [req.session.teacher.schoolid, req.body.classname[i]],
                  (error, rows) => {
                    if (error) {
                      console.log(error);
                    }
                    console.log("all students", rows);
                    for (var j in rows) {
                      db.query(
                        `INSERT INTO assignPdf (assignByTeacher ,assignToStudent, studentDescription, pdfid, pdfForStudent,assignFrom,dateAssignedByTeacher) values (?,?,?,?,?,?,?)`,

                        [
                          req.session.teacher.firstname +
                            " " +
                            req.session.teacher.lastname,
                          rows[j].id,
                          req.body.textarea,
                          pdfid,
                          tkpdfurl,
                          req.session.teacher.id,
                          lastedit,
                        ]
                      );
                    }
                  }
                );
              }
            }
          );
        }
        if (typeof req.body.classname == "string") {
          console.log("it is string");
          db.query(
            "SELECT * FROM assignPdf WHERE assignid=?",
            [req.body.currentassignid],
            (error, rows) => {
              console.log(rows);
              tkpdfurl = rows[0].pdfOfTeacher;
              pdfid = rows[0].pdfid;

              db.query(
                `SELECT * FROM student where schoolid = ? AND classid =?`,
                [req.session.teacher.schoolid, req.body.classname],
                (error, rows) => {
                  let i = 0;
                  console.log(i++);
                  if (error) {
                    console.log(error);
                  }
                  for (var j in rows) {
                    console.log(rows[j].id);
                    db.query(
                      `INSERT INTO assignPdf (assignByTeacher ,assignToStudent, studentDescription, pdfid, pdfForStudent,assignFrom,dateAssignedByTeacher) values (?,?,?,?,?,?,?)`,

                      [
                        req.session.teacher.firstname +
                          " " +
                          req.session.teacher.lastname,
                        rows[j].id,
                        req.body.textarea,
                        pdfid,
                        tkpdfurl,
                        req.session.teacher.id,
                        lastedit,
                      ]
                    );
                  }
                }
              );
            }
          );
        }

        req.flash("message", "PDF assigned");
      }

      res.redirect("/teacher/assigned-to-student");
    } catch (error) {
      req.flash("emessage", "Failed to assign pdf, Please try again!");
      res.redirect("/teacher/assigned-to-student");
    }
  })
);

router.get("/student-view-assigned-logs", (req, res) => {
  res.render("teacher/student-view-assigned-logs", {
    layout: "layoutteacher",
  });
});

router.get(
  "/my-students",
  isLoggedIn,
  catchAsync(async function (req, res) {
    try {
      let active;
      if (req.url === "/my-students") {
        active = "active";
      } else active = "";
      let query = `SELECT st.*,(SELECT COUNT(*) FROM assignPdf WHERE assignToStudent = st.id) AS TotalAsign,(select schoolName from school where id = st.schoolid) AS school_name,(select className from class where id = st.classid) AS class_name FROM student AS st WHERE st.schoolid = ${req.session.teacher.schoolid} ORDER BY st.id desc`;
      await db.query(query, (error, rows) => {
        if (error) {
          req.flash("message", "Database connection lost assignToStudent");
          res.redirect("/");
          return console.error(error.message);
        }

        res.render("teacher/my-students", {
          layout: "layoutteacher.hbs",
          activemystudents: active,
          message: req.flash("message"),
          rows: rows,
          imagePath: req.session.teacher.imagePath,
          username:
            req.session.teacher.firstname + " " + req.session.teacher.lastname,
          user: req.session.teacher,
        });
      });
    } catch (error) {
      req.flash("message", "syntax error");
      res.redirect("/");
      console.log(error);
    }
  })
);

// music files Duplicate Start
router.get(
  "/music-files",
  isLoggedIn,
  catchAsync(async function (req, res) {
    try {
      let active;
      if (req.url === "/music-files") {
        active = "active";
      } else active = "";
      let query = `select id,musicName,musicurl, music_create_time as created_at From music`;
      await db.query(query, (error, rows) => {
        if (error) {
          req.flash("message", "Database connection lost music");
          res.redirect("/");
          return console.error(error.message);
        }
        res.render("teacher/music-files", {
          layout: "layoutteacher.hbs",
          activemusicfile: active,
          message: req.flash("message"),
          rows: rows,
          imagePath: req.session.teacher.imagePath,
          username:
            req.session.teacher.firstname + " " + req.session.teacher.lastname,
          user: req.session.teacher,
        });
      });
    } catch (error) {
      req.flash("message", "syntax error");
      res.redirect("/");
      console.log(error);
    }
  })
);

router.post(
  "/assigned-pdf-student-view",
  isLoggedIn,
  catchAsync(async (req, res) => {
    try {
      let active;
      if (req.url === "/assigned-pdf-student-view") {
        active = "active";
      } else active = "";
      let studentid = req.body.id;
      let tn = parseInt(studentid);
      db.query(
        "SELECT t.*,p.*,ap.*,(SELECT COUNT(assignid) FROM assignPdf WHERE assignToStudent = t.id) AS TotalPdf FROM `assignPdf` AS ap ,`student` AS t , `pdf` AS  p WHERE t.id = ap.assignToStudent AND t.id =? AND p.pdfid = ap.pdfid ORDER BY ap.assignid desc",
        [studentid],
        (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost assignPdf");
            res.redirect("/");
            return console.log(error);
          }
          res.render("teacher/assigned-pdf-student-view", {
            layout: "layoutteacher",
            activemystudents: active,
            rows,
            username:
              req.session.teacher.firstname +
              " " +
              req.session.teacher.lastname,
            imagePath: req.session.teacher.imagePath,
            message: req.flash("message"),
          });
        }
      );
    } catch (error) {
      req.flash("message", "Database connection lost assignPdf");
      res.redirect("/");
      console.log(error);
    }
  })
);

router.post(
  "/change-student-status",
  catchAsync(async (req, res) => {
    try {
      if (req.body.status === "active") {
        let changestatus = "UPDATE user set isActive=? WHERE id=?";
        let dataid = ["inactive", req.body.id];
        await db.query(changestatus, dataid, (error) => {
          if (error) {
            req.flash("message", "Database connection lost UPDATE");
            res.redirect("/");
            return console.error(error.message);
          }
          res.redirect("/teacher/my-students");
        });
      } else {
        let changestatus = "UPDATE user set isActive=? WHERE id=?";
        let dataid = ["active", req.body.id];
        await db.query(changestatus, dataid, (error) => {
          if (error) {
            req.flash("message", "Database connection lost UPDATE");
            res.redirect("/");
            return console.error(error.message);
          }
          res.redirect("/teacher/my-students");
        });
      }
    } catch (error) {
      req.flash("message", "syntax error");
      res.redirect("/");
      console.log(error);
    }
  })
);
router.get("/student-view-assigned-logs", function (req, res) {
  //login
  res.render("user/student-view-assigned-logs", { layout: "layoutteacher" });
});

router.get("/view-student-pdf", function (req, res) {
  let active = "active";
  let studenturl = req.session.tranfering_value;
  res.render("teacher/view-student-pdf", {
    layout: "layoutteacher.hbs",
    studenturl,
    activeassignedtostudent: active,
    imagePath: req.session.teacher.imagePath,
    username:
      req.session.teacher.firstname + " " + req.session.teacher.lastname,
    user: req.session.teacher,
  });
});

router.get("/view-pdf", function (req, res) {
  let active = "active";
  let pdfurl = req.session.tranfering_value;
  res.render("teacher/view-pdf", {
    layout: "layoutteacher.hbs",
    pdfurl,
    activemystudents: active,
    imagePath: req.session.teacher.imagePath,
    username:
      req.session.teacher.firstname + " " + req.session.teacher.lastname,
    user: req.session.teacher,
  });
});

router.post("/view-pdf", isLoggedIn, (req, res) => {
  if (req.body.url) {
    req.session.tranfering_value = req.body.url;
    res.redirect("/teacher/view-pdf");
  } else {
    req.flash("message", "No PDF");
    res.redirect("/teacher/assigned-by-admin");
  }
});

router.post("/view-student-pdf", isLoggedIn, (req, res) => {
  try {
    db.query(
      "SELECT * from assignPdf WHERE assignid =?",
      [req.body.assignid],
      (error, rows) => {
        if (error) {
          req.flash("message", "Database connection lost assignPdf");
          res.redirect("/");
          return console.log(error);
        }
        studenturl = rows[0].pdfOfStudent;
        if (studenturl === "") {
          req.flash("message", "Student has not started working on this pdf");
          res.redirect("/teacher/assigned-to-student");
        } else {
          req.session.tranfering_value = studenturl;
          res.redirect("/teacher/view-student-pdf");
        }
      }
    );
  } catch (error) {
    req.flash("message", "syntax error");
    res.redirect("/");
    console.log(error);
  }
});

router.get("/logout", function (req, res) {
  try {
    if (req.session.teacher) {
      let a = standardDate.date();
      let updateuser = "UPDATE teacher SET lastlogintime =? WHERE id =?";
      let updatedata = [a, req.session.teacher.id];
      db.query(updateuser, updatedata, (error) => {
        if (error) {
          req.flash(
            "message",
            "Database connection lost  teacher SET lastlogintime"
          );
          res.redirect("/");
          return console.error(error.message);
        }
      });
      req.session.teacher = undefined;
      req.logout();
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    req.flash("message", "syxtax Error");
    res.redirect("/");
    console.log(error);
  }
});

module.exports = router;
function isLoggedIn(req, res, next) {
  if (req.session.teacher === undefined) {
    res.redirect("/user/login");
  } else {
    return next();
  }
}

// Assign Music start

router.get("/assigned-by-admin-music", isLoggedIn, function (req, res) {
  //login
  try {
    let active;
    if (req.url === "/assigned-by-admin-music") {
      active = "active";
    } else active = "";
    db.query(
      "SELECT t.*,p.*,ap.* FROM `assignmusic` AS ap ,`teacher` AS t , `music` AS p WHERE t.id = ap.assignTo AND p.id = ap.id AND t.id=? ORDER BY ap.assignid desc",
      [req.session.teacher.id],
      (error, rows) => {
        console.log({ rows });
        if (error) {
          req.flash("message", "Database connection lost assignmusic");
          res.redirect("/");
          return console.log(error);
        }

        res.render("teacher/assigned-by-admin-music", {
          layout: "layoutteacher.hbs",
          rows: rows,
          activeassignedbyadminMusic: active,
          message: req.flash("message"),
          username:
            req.session.teacher.firstname + " " + req.session.teacher.lastname,
          user: req.session.teacher,
          imagePath: req.session.teacher.imagePath,
        });
      }
    );
  } catch (error) {
    req.flash("message", "syntax error");
    res.redirect("/");
    console.log(error);
  }
});

// Assign Music End
//  <h1>Please Watch This Video for More Information: <a href="https://vimeo.com/751965999" target="_blank" >Click Here</a></h1>
