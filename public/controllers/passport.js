var LocalStrategy = require("passport-local").Strategy;

var mysql = require("mysql");
var bcrypt = require("bcrypt-nodejs");
//var dbconfig = require("./database");

//const { db } = require("../../models/user");
//var connection = mysql.createConnection(dbconfig.connection);

//connection.query("USE " + dbconfig.database);
let student,
  teacher,
  admin = false;
module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    // console.log(user.id);
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    if (student) {
      db.query(
        "SELECT * FROM student WHERE id = ?",
        [id],
        function (err, rows) {
          // console.log(rows);
          if (err) {
            return console.log(error);
          }
          if (rows) {
            done(err, rows[0]);
          }
        }
      );
    } else if (teacher) {
      db.query(
        "SELECT * FROM teacher WHERE id = ?",
        [id],
        function (err, rows) {
          // console.log(rows);
          if (err) {
            return console.log(error);
          }
          if (rows) {
            done(err, rows[0]);
          }
        }
      );
    } else if (admin) {
      db.query("SELECT * FROM admin WHERE id = ?", [id], function (err, rows) {
        // console.log(rows);
        if (err) {
          return console.log(error);
        }
        if (rows) {
          done(err, rows[0]);
        }
      });
    }
  });
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        //   console.log("object" + req);
        //  console.log(email, password);
        db.query(
          "SELECT * FROM user WHERE email = ? ",
          [email],
          function (err, rows) {
            if (err) return done(err);
            if (rows.length) {
              return done(
                null,
                false,
                req.flash({ message: "email user found." })
              );
            } else {
              var newUserMysql = {
                username: email,
                password: bcrypt.hashSync(password, null, null),
              };
              //   console.log(newUserMysql);
              var insertQuery =
                "INSERT INTO user (firstname,lastname,email, password) values (?, ?)";

              db.query(
                insertQuery,
                [
                  newUserMysql.email,
                  newUserMysql.password,
                  // newUserMysql.firstname,
                  //  newUserMysql.lastname,
                ],
                function (err, rows) {
                  newUserMysql.id = rows.id;

                  return done(null, newUserMysql);
                }
              );
            }
          }
        );
      }
    )
  );

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true,
      },

      function (req, username, password, done) {
        // console.log(req.body);
        if (req.body.type === "user") {
          student = true;
          // console.log(username, password);
          let currentPassword = password;
          req.checkBody("username", "Invalid email").notEmpty().isEmail();
          req.checkBody("password", "Invalid password").notEmpty();
          var errors = req.validationErrors();
          if (errors) {
            var messages = [];
            errors.forEach(function (error) {
              messages.push(error.msg);
            });
            return done(null, false, req.flash("error", messages));
          }
          db.query(
            "SELECT * FROM student WHERE email =?",
            [username], //+            username,
            (err, rows, fields) => {
              // console.log("rows", rows);

              if (rows.length > 0) {
                if (err) return done(err);
                // if (!rows.length) {
                //   return done(null, false, { message: "No user found." });
                // }
                let inactive = "inactive";
                // console.log(inactive, rows[0].isActive);
                if (rows[0].isActive === inactive) {
                  //enable  later
                  return done(null, false, {
                    message: "Account Not Activated!",
                  });
                }
                if (rows) {
                  if (rows[0].password != currentPassword)
                    return done(null, false, { message: "wrong password" });
                }
                return done(null, rows[0]);
                // res.redirect("/user/student-sign-up");
              } else {
                student = false;
                teacher = true;
                db.query(
                  "SELECT * FROM teacher WHERE email =?",
                  [username], //+            username,
                  (err, rows, fields) => {
                    // console.log("rows" + rows);
                    if (err) return done(err);
                    if (!rows.length) {
                      return done(null, false, { message: "No user found." });
                    }

                    // var buf1 = rows[0].password;
                    // var buf2 = password;
                    //var x = compare(buf1, buf2);
                    //console.log("x: " + x);
                    let inactive = "inactive";
                    // console.log(inactive, rows[0].isActive);
                    if (rows[0].isActive === inactive) {
                      //enable  later
                      return done(null, false, {
                        message: "Account Not Activated!",
                      });
                    }
                    if (rows) {
                      if (rows[0].password != currentPassword)
                        return done(null, false, { message: "wrong password" });
                    }
                    return done(null, rows[0]);
                    // res.redirect("/teacher/teacher-dashboard");
                  }
                );
              }
            }
          );
        }
        // if (req.body.type === "teacher") {
        //   teacher = true;
        //   console.log("type " + req.body.type);
        //   console.log(username, password);
        //   let currentPassword = password;
        //   req
        //     .checkBody("username", "Invalid email")
        //     .notEmpty()
        //     .isEmail();
        //   req.checkBody("password", "Invalid password").notEmpty();
        //   var errors = req.validationErrors();
        //   if (errors) {
        //     var messages = [];
        //     errors.forEach(function(error) {
        //       messages.push(error.msg);
        //     });
        //     return done(null, false, req.flash("error", messages));
        //   }
        //   db.query(
        //     "SELECT * FROM teacher WHERE email =?",
        //     [username], //+            username,
        //     (err, rows, fields) => {
        //       console.log("rows" + rows);
        //       if (err) return done(err);
        //       if (!rows.length) {
        //         return done(null, false, { message: "No user found." });
        //       }

        //       // var buf1 = rows[0].password;
        //       // var buf2 = password;
        //       //var x = compare(buf1, buf2);
        //       //console.log("x: " + x);
        //       let inactive = "inactive";
        //       console.log(inactive, rows[0].isActive);
        //       if (rows[0].isActive === inactive) {
        //         //enable  later
        //         return done(null, false, { message: "Account Not Activated!" });
        //       }
        //       if (rows) {
        //         if (rows[0].password != currentPassword)
        //           return done(null, false, { message: "wrong password" });
        //       }
        //       return done(null, rows[0]);
        //     }
        //   );
        // }
        if (req.body.type === "admin") {
          // console.log(req.body.type);
          admin = true;
          // console.log(username, password);
          let currentPassword = password;
          req.checkBody("username", "Invalid email").notEmpty().isEmail();
          req.checkBody("password", "Invalid password").notEmpty();
          var errors = req.validationErrors();
          if (errors) {
            var messages = [];
            errors.forEach(function (error) {
              messages.push(error.msg);
            });
            return done(null, false, req.flash("error", messages));
          }
          db.query(
            "SELECT * FROM admin WHERE email =?",
            [username], //+            username,
            (err, rows, fields) => {
              // console.log("rows" + rows);
              if (err) return done(err);
              if (!rows.length) {
                return done(null, false, { message: "No user found." });
              }

              // var buf1 = rows[0].password;
              // var buf2 = password;
              //var x = compare(buf1, buf2);
              //console.log("x: " + x);
              let inactive = "inactive";
              // console.log(inactive, rows[0].isActive);
              // if (rows[0].isActive === inactive) {   //enable  later
              //   return done(null, false, { message: "Account Not Activated!" });
              // }
              if (rows) {
                if (rows[0].password != currentPassword)
                  return done(null, false, { message: "wrong password" });
              }
              return done(null, rows[0]);
            }
          );
        }
      }
    )
  );
};
