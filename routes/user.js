const express = require("express");
const request = require("request");
let cronJob = require("cron").CronJob;
var passport = require("passport");
const https = require("https");
//const auth = require("../public/user");
const AppError = require("../public/utils/appError");
const catchAsync = require("../public/utils/catchAsync");
const router = express.Router();

const path = require("path");
const fs = require("fs");
// const mime = require("mime");
const sendEmail = require(".././public/utils/email");
//const checkAuth = require("../public/check-auth");
const studentValidation = require("../public/validation/student");
const standardDate = require("../public/otherFunctions/standardDate");

router.get("/all_student_email", function (req, res) {
  let query = `select * from student`;
  db.query(query, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

router.get("/all_teacher/:id", async function (req, res) {
  try {
    var messages = req.flash("error");
    let teachers;
    db.query(
      `SELECT * FROM teacher where teacher.isActive = "active" and schoolid = ?`,
      [req.params.id],
      (error, rows) => {
        if (error) {
          req.flash("message", "Database connection lost teacher");
          res.redirect("/user/student-edit-profile");
          console.log(error);
        }
        res.json(rows);
      }
    );
  } catch (error) {
    req.flash("message", "syntax Error");
    res.redirect("/user/student-edit-profile");
  }
});

router.get("/all_class/:id", async function (req, res) {
  var messages = req.flash("error");
  let teachers;

  db.query(
    `SELECT * FROM class where class.isActive = "active" and schoolid = ?`,
    [req.params.id],
    (error, rows) => {
      if (error) {
        req.flash("message", "Database connection lost teacher");
        res.redirect("/user/student-edit-profile");
        console.log(error);
      }
      res.json(rows);
    }
  );
});
router.get("/all_student", async function (req, res) {
  var messages = req.flash("error");
  let teachers;
  db.query(
    `SELECT * FROM student AS s WHERE s.schoolid=${req.session.teacher.schoolid} AND s.isActive = "active"`,
    [req.params.id],
    (error, rows) => {
      if (error) {
        req.flash("message", "Database connection lost teacher");
        res.redirect("/");
        console.log(error);
      }
      res.json(rows);
    }
  );
});
///////////// REST API   //////////////

router.get("/login", notLoggedIn, function (req, res) {
  res.render("user/login", {
    layout: "",
    message: req.flash("message"),
    error: req.flash("error"),
  });
});

router.post("/login", function (req, res) {
  let { username, password } = req.body;
  let message = "";
  let isError = false;
  console.log("------------- here we are ----------");
  if (!username || !password) {
    message = "Missing credentials";
    req.flash("error", message);
    res.redirect("/user/login");
  } else {
    db.query(
      "SELECT * FROM student WHERE email =?",
      [username],
      (err, rows, fields) => {
        if (err) {
          req.flash("message", "Database connection lost teacher");
          res.redirect("/");
          console.log(err);
        }
        let inactive = "inactive";
        if (rows && rows.length > 0) {
          if (rows[0].isActive === inactive) {
            message = "Account Not Activated!";
            req.flash("error", message);
            res.redirect("/user/login");
          } else if (rows[0].password != password) {
            message = "wrong password";
            req.flash("error", message);
            res.redirect("/user/login");
          } else if (rows[0].password == password) {
            req.session.student = rows[0];
            res.redirect("/user/student-dashboard");
          }
        } else {
          db.query(
            "SELECT * FROM teacher WHERE email =?",
            [username],
            (err, rows, fields) => {
              console.log("rows..............................");
              if (err) {
                req.flash("message", "Database connection lost teacher");
                res.redirect("/");
                console.log(err);
              }
              if (rows && rows.length === 0) {
                req.flash("error", "Email not found");
                res.redirect("/user/login");
              } else if (rows[0].isActive == "inactive") {
                message = "Account Not Activated!";
                req.flash("error", message);
                res.redirect("/user/login");
              } else if (rows && rows.length > 0) {
                if (rows[0].password != password) {
                  req.flash("error", "wrong password");
                  res.redirect("/user/login");
                } else if (rows[0].password == password) {
                  req.session.teacher = rows[0];
                  res.redirect("/teacher/teacher-dashboard");
                }
              }
            }
          );
        }
      }
    );
  }
});

let schoolName;
let teachers;
let classname;
router.get("/student-sign-up", async function (req, res) {
  var messages = req.flash("error");
  let teachers;
  db.query(
    `SELECT * FROM teacher where teacher.isActive = "active"`,
    (error, rows) => {
      teachers = rows;
      console.log("teachers");
      db.query(
        `SELECT * FROM class where class.isActive = "active"`,
        (error, rows) => {
          classname = rows;
          db.query(
            `SELECT * FROM school where school.isActive = "active"`,
            (error, rows) => {
              rows.sort((a, b) => (a.schoolName > b.schoolName ? 1 : -1));
              schoolName = rows;
              console.log("school");
              res.render("user/student-sign-up", {
                layout: "",
                teachers: teachers,
                schoolName,
                classname,
                messages: messages,
                message: req.flash("message"),
                hasErrors: messages.length > 0,
              });
            }
          );
        }
      );
    }
  );
});
router.post("/student-sign-up", (req, res) => {
  let validationResult = studentValidation.Signup(req.body);
  if (validationResult == false) {
    let role = "student";
    var findquery =
      "SELECT s.*,t.* FROM student AS s,teacher AS t WHERE s.email=? OR t.email=?";
    db.query(findquery, [req.body.email, req.body.email], (error, results) => {
      if (results.length > 0) {
        req.flash("message", "Email already Exists");
        res.redirect("/user/student-sign-up");
      } else {
        let create_time = standardDate.date();
        var insertQuery =
          "INSERT INTO student (firstname,lastname,email, password,mobile,schoolid,teacherid,classid,enrollmentnumber,role,create_time) values (?, ?, ?, ?, ?, ?, ?, ?,?,?,?)";
        db.query(
          insertQuery,
          [
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            req.body.password,
            req.body.mobile,
            req.body.schoolid,
            req.body.teacherid,
            req.body.classid,
            req.body.enrollmentnumber,
            role,
            create_time,
            // newUserMysql.firstname,
            //  newUserMysql.lastname,
          ],
          async (err, result) => {
            if (err) {
              req.flash("message", "SignUp failed");
              res.redirect("/user/login");
            } else {
              db.query("SELECT * FROM admin", async (err, rows) => {
                if (err) {
                  console.log(err);
                }
                for (var i in rows) {
                  try {
                    console.log(rows[i].email);
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
                <td style="padding: 11px 17px; ">Dear Admin,</td>  
            </tr>
            <tr>
                <td style="padding: 4px 17px;">${req.body.firstname} ${req.body.lastname} has registered to access to the digital L havin Ulehaskil project.</td>
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
                    console.log("sending mail");
                    await sendEmail({
                      email: rows[i].email,
                      subject: `${req.body.firstname} ${req.body.lastname}, has Registered`,
                      //  subject: 'Your password reset token (valid for 10 min)',
                      message,
                    });
                  } catch (e) {
                    console.log("error sending mail", e);
                  }
                }

                req.flash(
                  "message",
                  `You have Successfully Signed Up! You will be able to login once your Account is Activated!
                 
                  `
                );
                res.redirect("/user/login");
              });
            }
          }
        );
      }
    });
  } else {
    req.flash("message", validationResult);
    res.redirect("/user/student-sign-up");
  }
});

router.post(
  "/forgot-password",

  catchAsync(async function (req, res, next) {
    try {
      let userdata;
      var messages = req.flash("error");

      await db.query(
        "SELECT * FROM student WHERE email = ?",
        [req.body.email],
        catchAsync(async function (err, rows, next) {
          console.log(err);
          if (rows && rows.length > 0) {
            let resettoken = rows[0].id;
            const resetUrl = `https://lhavin.com/user/resetPassword/${resettoken}`;

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
            <tr>
                <td align="center">
                    <h1 style="color:#fff; padding-top: 15px; margin-bottom: 0px;">Reset Password</h1>
                </td>
                
            </tr>

        </table>
        <table style="color: #000;font-size: 16px; text-align:justify;">
            <tr>
                <td style="padding: 11px 17px; ">Dear ${rows[0].firstname},</td>
            </tr>
            <tr>
                <td style="padding: 4px 17px;">We have recieved a request to have your password reset for <b>Jewesh</b>. If you did not make this request, please ignore this email.  <br>
      <br> To reset your password, please <a href = "${resetUrl}"> <b>Visit this link</b> </a> </td>
            </tr>
            <tr>
                <td style="padding: 9px 17px; "><b>Having Trouble? </b></td>
            </tr>
            <tr>
                <td style="padding: 9px 17px; ">If the above link does not work try copying this link into your browser.</td>
            </tr>
            <tr>
                <td style="padding: 9px 17px; ">${resetUrl}</p></td>
            </tr>          
            <tr>
                <td style="padding: 9px 17px; ">You are receiving this email from COJDS because you have requested to reset your password. If you did not make such a request, please email <a href="mailto:admin@lhavin.com" style="color: #0000EE; font-weight: bold;">admin@lhavin.com.</a></td>
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

            await sendEmail({
              email: req.body.email,
              subject: `Hi, forgot password? Reset here`,
              //  subject: 'Your password reset token (valid for 10 min)',
              message,
            });
            req.flash("message", "Password Reset link Sent Successfully");
            res.redirect("/user/login");
          } else {
            await db.query(
              "SELECT * FROM teacher WHERE email = ?",
              [req.body.email],
              catchAsync(async function (err, rows, next) {
                console.log(err);
                let resettoken = rows[0].id;
                const resetUrl = `https://lhavin.com/teacher/resetPassword/${resettoken}`;

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
            <tr>
                <td align="center">
                    <h1 style="color:#fff; padding-top: 15px; margin-bottom: 0px;">Reset Password</h1>
                </td>
                
            </tr>

        </table>
        <table style="color: #000;font-size: 16px; text-align:justify;">
            <tr>
                <td style="padding: 11px 17px; ">Dear ${rows[0].firstname},</td>
            </tr>
            <tr>
                <td style="padding: 4px 17px;">We have recieved a request to have your password reset for <b>Jewesh</b>. If you did not make this request, please ignore this email.  <br>
      <br> To reset your password, please <a href = "${resetUrl}"> <b>Visit this link</b> </a> </td>
            </tr>
            <tr>
                <td style="padding: 9px 17px; "><b>Having Trouble? </b></td>
            </tr>
            <tr>
                <td style="padding: 9px 17px; ">If the above link does not work try copying this link into your browser.</td>
            </tr>
            <tr>
                <td style="padding: 9px 17px; ">${resetUrl}</p></td>
            </tr>          
            <tr>
                <td style="padding: 9px 17px; ">You are receiving this email from COJDS because you have requested to reset your password. If you did not make such a request, please email <a href="mailto:admin@lhavin.com" style="color: #0000EE; font-weight: bold;">admin@lhavin.com.</a></td>
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

                await sendEmail({
                  email: req.body.email,
                  subject: `Hi, forgot password? Reset here`,
                  //  subject: 'Your password reset token (valid for 10 min)',
                  message,
                });
                req.flash("message", "Password Reset link Sent Successfully");
                res.redirect("/user/login"); //flash msg remaining
              })
            );
          }
        })
      );
    } catch (err) {
      req.flash("error", "Email not Found");
      res.redirect("/user/login");
    }
  })
);

router.get(
  "/resetPassword/:id",

  catchAsync(async function (req, res, next) {
    res.render("user/reset-password", { layout: "", id: req.params.id });
  })
);
router.post(
  "/resetPassword/:id",

  catchAsync(async function (req, res, next) {
    let updatedata = "UPDATE student SET password =? WHERE id =?";
    let data = [req.body.newpassword, req.params.id];

    db.query(updatedata, data, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }

      req.flash("message", "Password Updated Successfully");
      res.redirect("/user/login");
    });
  })
);

router.get("/student-change-password", isLoggedIn, function (req, res, next) {
  //login
  let active;
  if (req.url === "/student-change-password") {
    active = "active";
  } else active = "";
  var messages = req.flash("error");
  res.render("user/student-change-password", {
    layout: "layoutstudent.hbs",
    title: "student-change-password",
    studentchangepassword: active,
    username:
      req.session.student.firstname + " " + req.session.student.lastname,
    message: req.flash("message"),
    Emessage: req.flash("Emessage"),
    messages: messages,
    hasErrors: messages.length > 0,
    imagePath: req.session.student.imagePath,
  });
});
router.post(
  "/student-change-password",
  isLoggedIn,
  catchAsync(async function (req, res, next, done) {
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;
    let confirmpassword = req.body.confirmpassword;
    let finduser = "SELECT * FROM student WHERE id =?";
    let data = req.session.student.id;
    await db.query(finduser, data, async (error, rows, fields) => {
      if (error) {
        return console.error(error.message);
      }
      if (oldpassword != rows[0].password) {
        console.log("password did not matched");
        var messages = req.flash("error");
        req.flash("Emessage", "old password is not correct");
        res.redirect("/user/student-change-password");
      } else {
        let updateuser = "UPDATE student SET password =? WHERE id =?";
        let updatedata = [newpassword, req.session.student.id];
        await db.query(updateuser, updatedata, (error, results, fields) => {
          if (error) {
            return console.error(error.message);
          }
          console.log("Rows affected:", results.affectedRows);
          req.flash("message", "Password Updated");
          res.redirect("/user/student-change-password");
        });
      }
    });
  })
);

function isLoggedIn(req, res, next) {
  if (req.session.student === undefined) {
    res.redirect("/user/login");
  } else {
    return next();
  }
}

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
function restrictTo(...roles) {
  return (req, res, next) => {
    // console.log(req.session.student.role);
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.session.student.role)) {
      //req.flash({ message: "Not Authorized" });
      return res.redirect("login"); //{ message: "email user found." }
    }

    //next();
  };
}

router.all("*", function (req, res, next) {
  if (req.session.student == undefined) {
    res.redirect("/user/login");
  } else {
    next();
  }
});

//router.post;
router.get(
  "/student-dashboard",
  isLoggedIn,

  catchAsync(async (req, res) => {
    try {
      let active;
      if (req.url === "/student-dashboard") {
        active = "active";
      } else active = "";
      let recentpdfassigntostudent;
      let totalpdfassignedtostudent;
      let compltedpdf = 0;

      await db.query(
        "SELECT t.*, p.*, ap.*, (SELECT COUNT(assignid) FROM assignPdf WHERE assignToStudent = s.id) AS TotalPdf FROM `assignPdf` AS ap,`student` AS s,`pdf` AS p,`teacher` AS t WHERE s.id = ap.assignToStudent AND p.pdfid = ap.pdfid AND t.id = ap.assignFrom AND s.id=? order BY ap.assignid DESC LIMIT 5",
        [req.session.student.id],
        async (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost student");
            res.redirect("/user/student-edit-profile");
            return console.log(error);
          }
          await rows.map((data) => {
            if (data.pdfstatus == 1) {
              compltedpdf++;
            }
          });
          recentpdfassigntostudent = rows;
          totalpdfassignedtostudent =
            rows[0] && rows[0].TotalPdf ? rows[0].TotalPdf : 0;
          res.render("user/student-dashboard", {
            layout: "layoutstudent.hbs",
            message: req.flash("message"),
            dashboardactive: active,
            username:
              req.session.student.firstname +
              " " +
              req.session.student.lastname,
            user: req.session.student,
            totalpdfassignedtostudent,
            recentpdfassigntostudent,
            lastlogintime: req.session.student.lastlogintime,
            imagePath: req.session.student.imagePath,
            //  imagePath: rows[0].imagePath,
            compltedpdf,
          });
        }
      );
    } catch (error) {
      req.flash("message", "syntax error");
      res.redirect("/user/student-edit-profile");
      console.log(error);
    }
  })
);

router.post(
  "/upload",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
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
    const name1 = name[0];
    let extension = mime.extension(type);
    const rand = Math.ceil(Math.random() * 1000);
    //Random photo name with timeStamp so it will not overide previous images.
    const filenameOriginal = `${req.session.student.firstname}.${req.files.photo.name}`;
    const remsp = filenameOriginal.split(" ").join("_");
    const fileName = remsp;

    let abc = "abc";
    path3 = path.resolve(`./public/userImages`);

    let localpath = `${path3}/`;

    if (!fs.existsSync(localpath)) {
      fs.mkdirSync(localpath);
    }

    fs.writeFileSync(`${localpath}` + fileName, imageBuffer, "utf8");
    ip = url1; // 'cuboidtechnologies.com';
    const url = `${ip}/userImages/${fileName}`;
    let getdata = "UPDATE student SET imagePath=? WHERE id=?";
    let dataid = [url, req.session.student.id];

    await db.query(getdata, dataid, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      req.flash("message", "Image uploaded Successfully");
      req.session.student.imagePath = url;
      res.redirect("/user/student-dashboard");
    });
  })
);

router.get("/student-edit-profile", isLoggedIn, (req, res) => {
  let active;
  let all_class, all_teacher, all_school;
  if (req.url === "/student-edit-profile") {
    active = "active";
  } else active = "";
  db.query(
    `SELECT * FROM teacher where teacher.isActive = "active"`,
    (error, rows) => {
      all_teacher = rows;
      db.query(
        `SELECT * FROM school where school.isActive = "active"`,
        (error, rows) => {
          all_school = rows;
          db.query(
            `SELECT * FROM class where class.isActive = "active"`,
            (error, rows) => {
              all_class = rows;
              console.log("inside edit profile");
              db.query(
                "select st.*,(select firstname from teacher where id = st.teacherid) AS teacher_name,(select schoolName from school where id = st.schoolid) AS school_name,(select className from class where id = st.classid) AS class_name from student AS st WHERE st.id = ?",
                [req.session.student.id],
                (err, rows) => {
                  res.render("user/student-edit-profile", {
                    layout: "layoutstudent.hbs",
                    studenteditprofileactive: active,
                    message: req.flash("message"),
                    failed: req.flash("failed"),
                    username:
                      req.session.student.firstname +
                      " " +
                      req.session.student.lastname,
                    rows,
                    imagePath: req.session.student.imagePath,
                    all_class,
                    all_teacher,
                    all_school,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});
router.post("/student-edit-profile", isLoggedIn, function (req, res) {
  let lastname = req.body.lastname;
  let updatedata =
    "UPDATE student SET firstname =?, lastname= ?, email =?, mobile =?  WHERE id =?";
  let data = [
    req.body.firstname,
    req.body.lastname,
    req.body.email,
    req.body.mobile,
    req.session.student.id,
  ];

  if (req.body.oldemail == req.body.email) {
    db.query(updatedata, data, (error, results, fields) => {
      if (error) {
        req.flash("message", "Database connection lost student");
        res.redirect("/");
        return console.error(error.message);
      }
      db.query(
        "SELECT * FROM student WHERE id =?",
        [req.session.student.id],
        (err, rows, fields) => {
          if (err) {
            req.flash("message", "Database connection lost student");
            res.redirect("/");
            console.log(err);
          }
          if (rows && rows.length > 0) {
            req.session.student = rows[0];
          }
          req.flash("message", "Profile Updated Successfully");
          res.redirect("/user/student-edit-profile");
        }
      );
    });
  } else {
    db.query(
      `SELECT t.*,s.* FROM teacher AS t,student AS s where s.email = "${req.body.email}" or t.email = "${req.body.email}"`,
      (err, rows, fields) => {
        if (err) {
          req.flash("message", "Database connection lost student");
          res.redirect("/");
          console.log(err);
        }
        let inactive = "inactive";
        if (rows && rows.length > 0) {
          req.flash("failed", "Email already exist");
          res.redirect("/user/student-edit-profile");
        } else {
          db.query(updatedata, data, (error, results, fields) => {
            if (error) {
              req.flash("message", "Database connection lost student");
              res.redirect("/");
              return console.error(error.message);
            }

            db.query(
              "SELECT * FROM student WHERE id =?",
              [req.session.student.id],
              (err, rows, fields) => {
                if (err) {
                  req.flash("message", "Database connection lost student");
                  res.redirect("/");
                  console.log(err);
                }
                if (rows && rows.length > 0) {
                  req.session.student = rows[0];
                }
                req.flash("message", "Profile Updated Successfully");
                res.redirect("/user/student-edit-profile");
              }
            );
          });
        }
      }
    );
  }
});

router.get("/student-assigned-pdf", isLoggedIn, function (req, res, next) {
  //login
  let active;
  let completed = 1;
  if (req.url === "/student-assigned-pdf") {
    active = "active";
  } else active = "";
  db.query(
    "SELECT t.*, p.*, ap.* FROM `assignPdf` AS ap,`student` AS s,`pdf` AS p,`teacher` AS t WHERE s.id = ap.assignToStudent AND p.pdfid = ap.pdfid AND t.id = ap.assignFrom AND s.id=? AND ap.pdfstatus=0 order BY ap.assignid",
    [req.session.student.id],
    (error, rows) => {
      if (error) {
        req.flash("message", "Database connection lost student");
        res.redirect("/");
        return console.log(error);
      }

      res.render("user/student-assigned-pdf", {
        layout: "layoutstudent.hbs",
        title: "Student|Assigned PDF",
        message: req.flash("message"),
        studentassignedpdfactive: active,
        rows: rows,
        username:
          req.session.student.firstname + " " + req.session.student.lastname,
        imagePath: req.session.student.imagePath,
      });
    }
  );
});
//marking student assigned pdf status cimplete

router.get("/student-complete-pdf", isLoggedIn, function (req, res, next) {
  let active;
  if (req.url === "/student-complete-pdf") {
    active = "active";
  } else active = "";
  db.query(
    "SELECT t.*,p.*,ap.* FROM `student` AS t, `assignPdf` AS ap , `pdf` AS p WHERE t.id = ap.assignToStudent AND p.pdfid = ap.pdfid AND t.id=? AND ap.pdfstatus=1",
    [req.session.student.id],
    (error, rows) => {
      if (error) {
        req.flash("message", "Database connection lost student");
        res.redirect("/");
        return console.log(error);
      }

      res.render("user/student-complete-pdf", {
        layout: "layoutstudent.hbs",
        title: "Student | Completed PDF",
        message: req.flash("message"),
        studentcompletepdf: active,
        rows: rows,
        username:
          req.session.student.firstname + " " + req.session.student.lastname,
        imagePath: req.session.student.imagePath,
      });
    }
  );
});

router.post("/pdf-status-update", (req, res) => {
  let docid;
  lastedit = standardDate.date();
  db.query(
    `SELECT * from kamiKeyManagement WHERE id =?`,
    [1],
    (error, rows) => {
      if (!rows || !rows[0].kamiKey) {
        req.flash("message", "Invalid data from the database");
        return res.redirect("/");
      }
      console.log("this project is shit: ", error);
      let kamikey = rows[0].kamiKey;
      db.query(
        //"SELECT t.,p.,ap.* FROM `student` AS t, `assignPdf` AS ap , `pdf` AS p WHERE t.id = ap.assignToStudent AND p.pdfid = ap.pdfid AND t.id=1 AND assignid =?",
        "UPDATE assignPdf SET lastedit=? WHERE assignid=?",
        [lastedit, req.body.currentassignid],
        (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost assignPdf");
            res.redirect("/");
            console.log(error);
          }
          //console.log(rows);
          db.query(
            "select * from assignPdf WHERE assignid=?",
            [req.body.currentassignid],
            (error, rows) => {
              if (error) {
                req.flash("message", "Database connection lost assignPdf");
                res.redirect("/");
                console.log(error);
              }

              request.post(
                "https://api.notablepdf.com/embed/exports",
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Token y7NkeXoo5DNxaN3ecMyz",
                  },
                  body: {
                    document_identifier: rows[0].documentIdentifierStudent,
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
                        Authorization: "Token y7NkeXoo5DNxaN3ecMyz",
                      },
                    },
                    catchAsync(async function (error, response, body, next) {
                      console.log("inside create session function");

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
                              Authorization: "Token y7NkeXoo5DNxaN3ecMyz",
                            },
                          },
                          catchAsync(async function (
                            error,
                            response,
                            body,
                            next
                          ) {
                            //console.log("bodydata", body);
                            let bodydata = JSON.parse(body);
                            let docurl = bodydata.file_url;
                            let status = bodydata.status;

                            if (status === "done") {
                              console.log("inside done status");
                              const url = bodydata.file_url; // link to file you want to download
                              const path =
                                "./public/pdf/" + `${bodydata.id}` + ".pdf"; // where to save a file

                              const request = https.get(
                                url,
                                function (response) {
                                  if (response.statusCode === 200) {
                                    var file = fs.createWriteStream(path);
                                    response.pipe(file);
                                  }
                                  request.setTimeout(60000, function () {
                                    // if after 60s file not downlaoded, we abort a request
                                    request.abort();
                                  });
                                }
                              );
                              console.log("inside done status");

                              let url1 =
                                "https://lhavin.com" +
                                "/pdf/" +
                                `${bodydata.id}` +
                                ".pdf";

                              await db.query(
                                // edit it
                                // "UPDATE `pdf` SET `tkpdfurl`=?, `count`=? WHERE pdfid=?",

                                "UPDATE `assignPdf` SET `finalPdfOfStudent`=?, pdfstatus = 1 WHERE assignid=?",
                                [url1, req.body.currentassignid],
                                (error, rows) => {
                                  if (error) {
                                    req.flash(
                                      "message",
                                      "Database connection lost assignPdf"
                                    );
                                    res.redirect("/");
                                    return console.log(error);
                                  }

                                  req.flash(
                                    "message",
                                    "Pdf Marked as Completed!"
                                  );
                                  res.redirect("/user/student-assigned-pdf");
                                }
                              );
                              myJob.stop();
                            }
                            if (n === 25) {
                              myJob.stop();
                              req.flash("message", "Pdf Completion failed");
                              res.redirect("/user/student-assigned-pdf");
                            }
                            // console.log("hi : " + n++);
                          })
                        );
                        // }
                      });
                      if (bodydata.file_url === null) {
                        myJob.start();
                      }
                      if (bodydata.status == "done") {
                        const url = bodydata.file_url; // link to file you want to download
                        const path =
                          "./public/pdf/" + `${bodydata.id}` + ".pdf"; // where to save a file

                        const request = https.get(url, function (response) {
                          if (response.statusCode === 200) {
                            var file = fs.createWriteStream(path);
                            response.pipe(file);
                          }
                          request.setTimeout(60000, function () {
                            // if after 60s file not downlaoded, we abort a request
                            request.abort();
                          });
                        });
                        console.log("inside done status");

                        let url1 =
                          "https://lhavin.com" +
                          "/pdf/" +
                          `${bodydata.id}` +
                          ".pdf";
                        await db.query(
                          // edit it
                          // "UPDATE `pdf` SET `tkpdfurl`=?, `count`=? WHERE pdfid=?",

                          "UPDATE `assignPdf` SET `finalPdfOfStudent`=?, pdfstatus = 1 WHERE assignid=?",
                          [url1, req.body.currentassignid],
                          (error, rows) => {
                            if (error) {
                              req.flash(
                                "message",
                                "Database connection lost assignPdf"
                              );
                              res.redirect("/");
                              return console.log(error);
                            }

                            req.flash("message", "Pdf Marked as Completed!");
                            res.redirect("/user/student-assigned-pdf");
                          }
                        );
                      }
                    })
                  );
                })
              );
            }
          );
        }
      );
    }
  );
});

router.post("/viewPdf/:id", isLoggedIn, (req, res) => {
  let docid = "";
  let name = req.session.student.firstname;
  let userID = req.session.student.id;
  var USERID = userID.toString();
  var Name = name.toString();
  let currentassignid = req.body.assignid;
  studentassignedpdfactive = "active";
  let pdfid = req.params.id;
  /************updating last edit date************************** */

  lastedit = standardDate.date();

  db.query(
    `SELECT * from kamiKeyManagement WHERE id =?`,
    [1],
    (error, rows) => {
      let kamikey = rows[0].kamiKey;

      db.query(
        //"SELECT t.*,p.*,ap.* FROM `student` AS t, `assignPdf` AS ap , `pdf` AS p WHERE t.id = ap.assignToStudent AND p.pdfid = ap.pdfid AND t.id=1 AND assignid =?",
        "UPDATE pdf t1, assignPdf t2 SET  t2.lastedit=? WHERE t1.pdfid = t2.pdfid AND t2.assignid=?",
        [lastedit, currentassignid],
        (error, rows) => {
          if (error) {
            return console.log(error);
          }
          db.query(
            `INSERT INTO pdfEditHistoryByMember (assignPdf_id,pdfid,member, memberid,date,time,status) values (?,?,?,?,?,?,?)`,
            [
              currentassignid,
              pdfid,
              "student",
              req.session.student.id,
              lastedit.split(" ")[0],
              lastedit.split(" ")[1],
              "Edit",
            ],
            (error, rows) => {
              if (error) {
                req.flash("message", "Database connection lost assignPdf");
                res.redirect("/");
                return console.log("error", error);
              }

              /**************************************** */

              /*************KAMI**************** */
              db.query(
                "SELECT t.*,p.*,ap.* FROM `student` AS t, `assignPdf` AS ap , `pdf` AS p WHERE t.id = ap.assignToStudent AND p.pdfid = ap.pdfid AND t.id=? AND assignid=?",
                [req.session.student.id, currentassignid],
                //  [req.params.id],
                (error, rows) => {
                  // console.log(rows);
                  let data = rows;

                  let pdfurl = data[0].pdfForStudent;
                  let pfdurlofStudent = data[0].pdfOfStudent;
                  let pdfname = data[0].pdfname;
                  let scount = data[0].SCOUNT;

                  if (scount === 0) {
                    console.log("inside pdf count");
                    //  console.log("abc" + docid),
                    /*********************************************************************************************** */

                    request.post(
                      "https://api.notablepdf.com/embed/documents",
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: "Token y7NkeXoo5DNxaN3ecMyz",
                        },
                        body: {
                          document_url: pdfurl,
                          name: pdfname,
                        },
                        json: true,
                      },
                      catchAsync(async function (error, response, body, next) {
                        docid = body.document_identifier;

                        /************************************************************************************************ */
                        request.post(
                          "https://api.notablepdf.com/embed/sessions",
                          {
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: "Token y7NkeXoo5DNxaN3ecMyz",
                            },

                            body: JSON.stringify({
                              document_identifier: docid,
                              user: {
                                name:
                                  req.session.student.firstname +
                                  req.session.student.lastname,
                                user_id:
                                  req.session.student.id +
                                  req.session.student.firstname +
                                  req.session.student.lastname,
                              },
                              //expires_at: "2021-10-20T05:01:00.0Z",
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
                            }),
                          },
                          catchAsync(async function (
                            error,
                            response,
                            body,
                            next
                          ) {
                            var obj = JSON.parse(body);
                            let docurl = obj.viewer_url;

                            db.query(
                              // "UPDATE  pdf (document_identifier) values(?) WHERE pdfurl=?",
                              "UPDATE `assignPdf` SET `pdfOfStudent`=?, documentIdentifierStudent=?, `SCOUNT`=? WHERE assignid=?",
                              [docurl, docid, 1, currentassignid],
                              (error, rows) => {
                                if (error) {
                                  req.flash(
                                    "message",
                                    "Database connection lost assignPdf"
                                  );
                                  res.redirect("/");
                                  return console.log(error);
                                }

                                res.render("user/viewPdf", {
                                  layout: "layoutstudent.hbs",
                                  docurl,
                                  studentassignedpdfactive,
                                  username:
                                    req.session.student.firstname +
                                    " " +
                                    req.session.student.lastname,
                                  imagePath: req.session.student.imagePath,
                                  pdfid,
                                  currentassignid,
                                });
                              }
                            );
                          })
                        );
                      })
                    );
                  } else {
                    res.render("user/viewPdf", {
                      layout: "layoutstudent.hbs",
                      pfdurlofStudent,
                      pdfid,
                      currentassignid,
                      studentassignedpdfactive,
                      username:
                        req.session.student.firstname +
                        " " +
                        req.session.student.lastname,
                      imagePath: req.session.student.imagePath,
                    });
                  }
                }
              );

              /***********KAMI ENDS********************** */
            }
          );
        }
      );
    }
  );
});

router.post("/students-view-pdf", isLoggedIn, (req, res) => {
  let active = "active";
  let pdfurl = req.body.pdfurl;
  res.render("user/viewPdff1", {
    layout: "layoutstudent.hbs",

    pdfurl: pdfurl,
    dashboardactive: active,
    // dashboardactive: active,
    username:
      req.session.student.firstname + " " + req.session.student.lastname,
    imagePath: req.session.student.imagePath,
  });
});
router.post("/students-view-pdf", isLoggedIn, (req, res) => {
  let active = "active";
  let pdfurl = req.body.pdfurl;
  res.render("user/viewPdff1", {
    layout: "layoutstudent.hbs",
    pdfurl: pdfurl,
    dashboardactive: active,
    // dashboardactive: active,
    username:
      req.session.student.firstname + " " + req.session.student.lastname,
    imagePath: req.session.student.imagePath,
  });
});
router.post("/students-assigned-view-pdf", isLoggedIn, (req, res, next) => {
  let active = "active";

  let pdfurl = req.body.pdfurl;

  res.render("user/viewPdff1", {
    layout: "layoutstudent.hbs",
    pdfurl: pdfurl,
    studentassignedpdfactive: active,
    // dashboardactive: active,
    username:
      req.session.student.firstname + " " + req.session.student.lastname,
    imagePath: req.session.student.imagePath,
  });
});
router.post("/students-completed-view-pdf", isLoggedIn, (req, res, next) => {
  let active = "active";
  let pdfurl = req.body.pdfurl;
  res.render("user/viewPdff1", {
    layout: "layoutstudent.hbs",
    pdfurl: pdfurl,
    studentcompletepdf: active,
    // dashboardactive: active,
    username:
      req.session.student.firstname + " " + req.session.student.lastname,
    imagePath: req.session.student.imagePath,
  });
});

router.get("/logout", function (req, res) {
  if (req.session.student) {
    let a = standardDate.date();
    console.log(a);
    let updateuser = "UPDATE student SET lastlogintime =? WHERE id =?";
    let updatedata = [a, req.session.student.id];
    db.query(updateuser, updatedata, (error, results, fields) => {
      if (error) {
        req.flash("message", "Database connection lost student");
        res.redirect("/");
        return console.error(error.message);
      }
    });
    req.session.student = undefined;
    req.logout();
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

router.use("/", notLoggedIn, function (req, res, next) {
  next();
});

module.exports = router;
//<h1>Please Watch This Video for More Information: <a href="https://vimeo.com/751965999" target="_blank" >Click Here</a></h1>
