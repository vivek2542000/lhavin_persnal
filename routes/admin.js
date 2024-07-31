const express = require("express");
const passport = require("passport");
const path = require("path");
const fs = require("fs");
// const mime = require("mime");
const mime = require("mime-types");
const catchAsync = require("../public/utils/catchAsync");
const AppError = require("../public/utils/appError");
const router = express.Router();
const sendEmail = require(".././public/utils/email");
const Handlebars = require("handlebars");
//const fetch = require("node-fetch");
// const request = require("request");
// const { json } = require("body-parser");
// const { Console } = require("console");
const standardDate = require("../public/otherFunctions/standardDate");
const { isArray, isString } = require("util");
router.get("/login", notLoggedIn, function (req, res) {
  res.render("admin/admin-login", {
    layout: "",
    message: req.flash("message"),
  });
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

router.post("/login", notLoggedIn, function (req, res) {
  let { username, password } = req.body;
  let message = "";
  let isError = false;
  if (!username && !password) {
    message = "Missing credentials";
    req.flash("message", message);
    res.redirect("/admin/login");
  } else {
    db.query(
      "SELECT * FROM admin WHERE email =? AND password=?",
      [username, password],
      (err, rows, fields) => {
        // console.log(rows);

        if (err) {
          console.log(err);
        }
        if (rows && rows.length === 0) {
          message = "Email not found";
          req.flash("message", message);
          res.redirect("/admin/login");
        }
        let inactive = "inactive";
        if (rows && rows.length > 0) {
          if (rows[0].password != password) {
            message = "wrong password";
            req.flash("message", message);
            res.redirect("/admin/login");
          } else if (rows[0].password == password) {
            req.session.admin = rows[0];
            res.redirect("/admin/admin-dashboard");
          }
        }
      }
    );
  }
});

router.use("/login", notLoggedIn, function (req, res, next) {
  next();
});

function isLoggedIn(req, res, next) {
  if (req.session.admin === undefined) {
    res.redirect("/admin/login");
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

router.all("*", function (req, res, next) {
  if (req.session.admin == undefined) {
    res.redirect("/admin/login");
  } else {
    next();
  }
});

router.get(
  "/admin-dashboard",
  isLoggedIn,
  catchAsync(async function (req, res) {
    let totalstudents;
    let totalpdfs;
    let recentAssignedPdf;
    let active;
    if (req.url === "/admin-dashboard") {
      active = "active";
    } else active = "";
    db.query("SELECT * FROM student", (error, rows) => {
      try {
        if (error) {
          req.flash("message", "Database connection lost student");
          res.redirect("/admin/pdf-dashboard");
          return console.log(error);
        }
        totalstudents = rows && rows.length;
        db.query("SELECT * FROM pdf", (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost pdf");
            res.redirect("/admin/pdf-dashboard");
            return console.log(error);
          }
          totalpdfs = rows && rows.length;
          db.query(
            "SELECT t.*,p.*,ap.* FROM `assignPdf` AS ap ,`teacher` AS t , `pdf` AS p WHERE t.id = ap.assignTo AND p.pdfid = ap.pdfid AND assignBy='admin' order BY ap.assignid DESC LIMIT 5",
            (error, rows) => {
              if (error) {
                req.flash("message", "Database connection lost assign pdf");
                res.redirect("/admin/pdf-dashboard");
                return console.log(error);
              }
              recentAssignedPdf = rows;
              res.render("admin/admin-dashboard", {
                layout: "layoutadmin.hbs",
                message: req.flash("message"),
                activeadmindashboard: active,
                totalstudents,
                totalpdfs,
                recentAssignedPdf,
                imagePath: req.session.admin.imagePath,
                username:
                  req.session.admin.firstname +
                  " " +
                  req.session.admin.lastname,
                user: req.session.admin,
                lastlogintime: req.session.admin.lastlogintime,
              });
            }
          );
        });
      } catch (error) {
        req.flash("message", "Syntax Errors");
        res.redirect("/admin/pdf-dashboard");
        console.log(error);
      }
    });
  })
);

router.get("/manage-category", async (req, res) => {
  db.query("SELECT * FROM music_category", (error, rows) => {
    try {
      if (error) {
        req.flash("message", "Database connection lost music category");
        res.redirect("/");
        return console.log(error);
      }
      let categoryData = rows;
      let active;
      if (req.url === "/manage-category") {
        active = "active";
      } else active = "";

      res.render("admin/manage-category", {
        layout: "layoutadmin.hbs",
        message: req.flash("message"),
        activecategorymusic: active,
        categoryData: categoryData,
      });
    } catch (error) {
      console.log(error);
      req.flash("message", "Syntax Errors");
      res.redirect("/");
    }
  });
});

router.post("/save-category", async (req, res) => {
  try {
    let date_time = standardDate.date();
    let title = req.body.title;
    var insertQuery = "INSERT INTO music_category (title) values (?)";
    await db.query(insertQuery, [title, date_time]);
    req.flash("message", "Category Created Successfully");
    res.redirect("/admin/manage-category");
  } catch (error) {
    req.flash("message", "Syntax Error");
    res.redirect("/admin/manage-category");
    return console.log(error);
    // return new AppError("Something Went Wrong!", 400);
  }
});

/* 
// !! old function start

router.post("/save-category", async (req, res) => {
  let date_time = standardDate.date();
  let title = req.body.title;
  var insertQuery = "INSERT INTO music_category (title) values (?)";

  await db.query(insertQuery, [title, date_time], (error, rows) => {
    if (error) {
      console.log(error);
      return new AppError("Something Went Wrong!", 400);
    }
    req.flash("message", "Category Creacted Successfully");
    res.redirect("/admin/manage-category");
  });
});
// !! old function end
*/

router.post(
  //image upload route
  "/upload",
  isLoggedIn,
  catchAsync(async (req, res) => {
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
      const name1 = name[0];
      const rand = Math.ceil(Math.random() * 1000);
      //Random photo name with timeStamp so it will not overide previous images.
      const filenameOriginal = `${req.session.admin.firstname}.${req.files.photo.name}`;
      const remsp = filenameOriginal.split(" ").join("_");
      const fileName = remsp;
      // let abc = "abc";
      path3 = path.resolve(`./public/userImages`);
      let localpath = `${path3}/`;
      //console.log(localpath);

      if (!fs.existsSync(localpath)) {
        fs.mkdirSync(localpath);
      }
      //console.log(localpath);

      fs.writeFileSync(`${localpath}` + fileName, imageBuffer, "utf8");
      ip = url1;
      const url = `${ip}/userImages/${fileName}`;
      let getdata = "UPDATE admin SET imagePath=? WHERE id=?";
      let dataid = [url, req.session.admin.id];
      db.query(getdata, dataid, (error, results, fields) => {
        if (error) {
          return console.error(error.message);
        }
        req.session.admin.imagePath = url;
        req.flash("message", "Image uploaded Successfully");
        res.redirect("/admin/admin-dashboard");
      });
    } catch (error) {
      req.redirect("/");
      console.log(error);
    }
  })
);
/******************************/

//pdf-dashbaord

// Pdf Upload start
router.post(
  "/pdf-upload",
  isLoggedIn,
  catchAsync(async (req, res) => {
    try {
      let date_time = standardDate.date();
      const url1 = "https://lhavin.com";
      const processPdf = async (file) => {
        const selectedFile = file.data;
        const returnedB64 = Buffer.from(selectedFile).toString("base64");
        const matches = returnedB64;
        const response = {
          type: matches,
          data: new Buffer.from(matches, "base64"),
        };
        const decodedImg = response;
        const imageBuffer = decodedImg.data;
        const type = decodedImg.type;
        const name = type.split("/");
        const name1 = name[0];
        const fileNameOriginal = `${file.name}`;
        const fileName = fileNameOriginal.split(" ").join("_");
        const localPath = path.resolve(`./public/pdf`);

        if (!fs.existsSync(localPath)) {
          fs.mkdirSync(localPath);
        }

        fs.writeFileSync(`${localPath}/${fileName}`, imageBuffer, "utf8");
        const url = `${url1}/pdf/${fileName}`;

        return {
          fileName,
          url,
          date_time,
        };
      };

      const files = Array.isArray(req.files.pdf)
        ? req.files.pdf
        : [req.files.pdf];
      const uploadedPdfFiles = await Promise.all(files.map(processPdf));

      const insertQuery =
        "INSERT INTO pdf (pdfname, pdfurl, pdf_create_time) VALUES (?, ?, ?)";

      await Promise.all(
        uploadedPdfFiles.map((pdf) =>
          db.query(insertQuery, [pdf.fileName, pdf.url, pdf.date_time])
        )
      );

      req.flash("message", "Pdf uploaded Successfully");
      console.log("ending..");

      return res.status(200).json({
        status: "success",
      });
    } catch (e) {
      console.log("Here we are : ", e.message);
      res.send({ status: false, msg: "This is Pdf Upload :" + e.message });
    }
  })
);
// Pdf Upload End

/*
// !! Old function start
router.post(
  "/pdf-upload",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    //console.log(req.body.pdf);
    try {
      // console.log(req.body);
      let date_time = standardDate.date();
      if (!Array.isArray(req.files.pdf)) {
        // console.log("Hello1");
        //console.log(req.files);
        var selectedfile = req.files.pdf.data;
        let returnedB64 = Buffer.from(selectedfile).toString("base64");
        const url1 = "https://lhavin.com";
        //const url1 = "http://3.23.226.222:3000";
        var matches = returnedB64;
        response = {};
        //console.log(matches);
        response.type = matches;
        //console.log(response.type);
        response.data = new Buffer.from(matches, "base64");
        let decodedImg = response;
        let imageBuffer = decodedImg.data;
        let type = decodedImg.type;
        const name = type.split("/");
        //console.log(name);
        const name1 = name[0];
        //console.log(name1);
        // let extension = mime.extension(type);
        //console.log(extension);
        const rand = Math.ceil(Math.random() * 1000);
        //Random pdf name with timeStamp so it will not overide previous images.
        let nameOfFileInDB = req.files.pdf.name;
        // console.log("nameofiles :" + nameOfFileInDB);
        // const filenameOriginal = `${req.session.admin.firstname}.${req.files.pdf.name}`;
        const filenameOriginal = `${req.files.pdf.name}`;
        const remsp = filenameOriginal.split(" ").join("_");
        const fileName = remsp;
        //const fileName = `${req.session.admin.firstname}_${Date.now()}_.${extension}`;
        // let fileName = name1 ++ '.' + extension;
        // console.log(filename);
        let abc = "abc";
        path3 = path.resolve(`./public/pdf`);
        let localpath = `${path3}/`;
        //console.log(localpath);
        if (!fs.existsSync(localpath)) {
          fs.mkdirSync(localpath);
        }
        //console.log(localpath);
        fs.writeFileSync(`${localpath}` + fileName, imageBuffer, "utf8");
        ip = url1; // 'cuboidtechnologies.com';
        //console.log(ip);
        const url = `${ip}/pdf/${fileName}`;
        //const imagepath2 = fs.readFileSync(localpath + fileName);
        //console.log('imagepath2  ' + imagepath2);
        // const updating = await User.findByIdAndUpdate(req.session.admin._id, {
        //   $set: { imagepath: url },
        // });
        console.log(url);
        // let jurl = JSON.stringify(url);
        // console.log(jurl);
        // pdfArray.push(url);
        var insertQuery =
          "INSERT INTO pdf (pdfname,pdfurl,pdf_create_time) values (?, ?,?)";
        await db.query(
          insertQuery,
          [fileName, url, date_time],
          (error, rows) => {
            if (error) {
              return console.log(error);
            }
            // console.log(rows);
          }
        );
      }
      if (Array.isArray(req.files.pdf)) {
        // console.log("Hello1");
        for (var i in req.files.pdf) {
          // console.log("test:" + req.files.pdf[i].name);
          //console.log(req.files);
          var selectedfile = req.files.pdf[i].data;
          let returnedB64 = Buffer.from(selectedfile).toString("base64");
          // console.log(returnedB64);
          //console.log(req.session.admin);
          //const url1 = req.protocol + "://" + req.get("host");
          const url1 = "https://lhavin.com";
          var matches = returnedB64;
          response = {};
          //console.log(matches);
          response.type = matches;
          //console.log(response.type);
          response.data = new Buffer.from(matches, "base64");
          let decodedImg = response;
          let imageBuffer = decodedImg.data;
          let type = decodedImg.type;
          const name = type.split("/");
          //console.log(name);
          const name1 = name[0];
          //console.log(name1);
          // let extension = mime.extension(type);
          //console.log(extension);
          const rand = Math.ceil(Math.random() * 1000);
          //Random pdf name with timeStamp so it will not overide previous images.
          let nameOfFileInDB = req.files.pdf[i].name;
          // console.log("nameofiles :" + nameOfFileInDB);
          // const filenameOriginal = `${req.session.admin.firstname}.${req.files.pdf[i].name}`;
          const filenameOriginal = `${req.files.pdf[i].name}`;
          // console.log("index:" + filenameOriginal);
          const remsp = filenameOriginal.split(" ").join("_");
          const fileName = remsp;
          // console.log("filename:" + fileName);
          //const fileName = `${req.session.admin.firstname}_${Date.now()}_.${extension}`;
          // let fileName = name1 ++ '.' + extension;
          // console.log(filename);
          let abc = "abc";
          path3 = path.resolve(`./public/pdf`);
          let localpath = `${path3}/`;
          //console.log(localpath);
          if (!fs.existsSync(localpath)) {
            fs.mkdirSync(localpath);
          }
          //console.log(localpath);
          fs.writeFileSync(`${localpath}` + fileName, imageBuffer, "utf8");
          ip = url1; // 'cuboidtechnologies.com';
          //console.log(ip);
          const url = `${ip}/pdf/${fileName}`;
          //const imagepath2 = fs.readFileSync(localpath + fileName);
          //console.log('imagepath2  ' + imagepath2);
          // const updating = await User.findByIdAndUpdate(req.session.admin._id, {
          //   $set: { imagepath: url },
          // });
          // console.log(url);
          // let jurl = JSON.stringify(url);
          // console.log(jurl);
          // pdfArray.push(url);
          var insertQuery =
            "INSERT INTO pdf (pdfname,pdfurl,pdf_create_time) values (?, ?,?)";
          await db.query(
            insertQuery,
            [fileName, url, date_time],
            (error, rows) => {
              if (error) {
                return next(new AppError("Something Went Wrong!", 400));
              }
              // console.log(rows);
            }
          );
        }
      }
      req.flash("message", "Pdf uploaded Successfully");
      console.log("ending..");
      return res.status(200).json({
        status: "success",
      });
    } catch (e) {
      console.log("Here we are : ", e.message);
      res.send({ status: false, msg: "This is testing error :" + e.message });
    }
  })
);
// !! old function end 
*/
let teacherlist;
// let viewurl;

router.get(
  "/pdf-dashboard",
  isLoggedIn,
  catchAsync(async (req, res) => {
    try {
      let group;
      let active;
      if (req.url === "/pdf-dashboard") {
        active = "active";
      } else active = "";
      await db.query(
        `SELECT * FROM pdf`,
        catchAsync(async (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost pdf");
            res.redirect("/");
            return console.log(error);
            // return AppError("SomeThing Went Wrong");
          } else {
            totalItems = rows && rows.length;
          }
        })
      );

      let query = `SELECT * FROM pdf ORDER BY pdfid desc`;
      await db.query(
        `SELECT * FROM teacher where teacher.isActive = "active"`,
        catchAsync(async (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost teacher");
            res.redirect("/");
            return console.log(error);
            // return next(new AppError("Something Went Wrong!", 400));
          } else {
            teacherlist = rows;
          }
        })
      );
      await db.query(
        `SELECT * FROM teacherGroup`,
        catchAsync(async (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost teacher group");
            res.redirect("/");
            return console.log(error);
            // return next(new AppError("Something Went Wrong!", 400));
          } else {
            group = rows;
          }
        })
      );

      await db.query(
        query,
        catchAsync(async (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost teacherGroups");
            res.redirect("/");
            return console.log(error);
            // return next(new AppError("Something Went Wrong!", 400));
          } else {
            res.render("admin/pdf-dashboard", {
              layout: "layoutadmin.hbs",
              message: req.flash("message"),
              activepdfdashboard: active,
              rows: rows,
              group,
              teacherlist,
              imagePath: req.session.admin.imagePath,
              username:
                req.session.admin.firstname + " " + req.session.admin.lastname,
              user: req.session.admin,
            });
          }
        })
      );
    } catch (error) {
      console.log(error);
      req.flash("message", "Syntax Errors");
      res.redirect("/");
    }
  })
);

// assign music start

// assign music end

// music-delete-start
router.post("/delete-music", isLoggedIn, (req, res) => {
  let deletedata = "DELETE FROM music WHERE id=?";
  let deleetdatafromAssigmusic = "DELETE FROM music WHERE id=?";
  let dataid = [req.body.id];

  db.query(deletedata, dataid, (error, rows, fields) => {
    if (error) {
      return console.error(error.message);
    }
    db.query(deleetdatafromAssigmusic, dataid, (error, rows) => {
      if (error) {
        return console.log(error);
      }
      req.flash("message", "music Deleted Successfully");
      res.redirect("/admin/music-dashboard");
    });
  });
});
// music-delete end

// music category-delete  start
router.post("/delete-music-category", isLoggedIn, (req, res) => {
  // console.log(req.body);
  // console.log("inside");
  let deletedata = "DELETE FROM music_category WHERE cat_id=?";
  let deleetdatafromAssigmusic = "DELETE FROM music_category WHERE cat_id=?";
  let dataid = [req.body.id];
  //let data = ["student"];

  db.query(deletedata, dataid, (error, rows, fields) => {
    if (error) {
      return console.error(error.message);
    }
    db.query(deleetdatafromAssigmusic, dataid, (error, rows) => {
      if (error) {
        return console.log(error);
      }
      req.flash("message", "music-category Deleted Successfully");
      res.redirect("/admin/manage-category");
    });
  });
});
// music-category delete end

// Upload Audio With Category Starts
router.post(
  "/save-audio",
  isLoggedIn,
  catchAsync(async (req, res) => {
    try {
      const date_time = standardDate.date();
      const ip = "https://lhavin.com"; // Change this to your desired URL

      let musicFiles = req.files.music;
      if (!Array.isArray(musicFiles)) {
        musicFiles = [musicFiles];
      }

      const fileUrls = [];
      for (const file of musicFiles) {
        const selectedfile = file.data;
        const returnedB64 = Buffer.from(selectedfile).toString("base64");
        const matches = returnedB64;
        const response = {
          type: matches,
          data: Buffer.from(matches, "base64"),
        };
        const decodedImg = response;
        const imageBuffer = decodedImg.data;

        const filenameOriginal = file.name;
        const remsp = filenameOriginal.split(" ").join("_");
        const fileName = remsp;

        const localpath = path.resolve("./public/music");
        if (!fs.existsSync(localpath)) {
          fs.mkdirSync(localpath);
        }

        fs.writeFileSync(`${localpath}/${fileName}`, imageBuffer, "utf8");
        const url = `${ip}/music/${fileName}`;

        fileUrls.push({
          url,
          fileName,
          date_time,
        });
      }

      for (const music of fileUrls) {
        const insertQuery =
          "INSERT INTO music (musicName,cat_id,musicurl,music_create_time) values (?, ?, ?, ?)";
        await db.query(insertQuery, [
          music.fileName,
          req.body.cat_id,
          music.url,
          music.date_time,
        ]);
      }

      req.flash("message", "Music uploaded Successfully");
      return res.redirect("/admin/music-dashboard");
    } catch (error) {
      req.flash("message", "Syntax Error");
      res.redirect("/admin/music-dashboard");
      return console.log(error);
      // return new AppError("Something Went Wrong", 400);
    }
  })
);

// Upload Audio with Category End Gere

// music upload start

router.get(
  "/music-dashboard",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let group;
    let active;
    let category;
    try {
      if (req.url === "/music-dashboard") {
        active = "active";
      } else active = "";

      await db.query(
        `SELECT * FROM music`,
        catchAsync(async (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost music");
            res.redirect("/");
            return console.log(error);
            // return new AppError("SomeThing Went Wrong", 400);
          } else {
            rows;
          }
        })
      );
      await db.query(
        `SELECT * FROM music_category WHERE status=1`,
        catchAsync(async (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost music_category");
            res.redirect("/");
            return console.log(error);
            // return new AppError("SomeThing Went Wrong", 400);
          } else {
            category = rows;
          }
        })
      );
      let query = `SELECT *,
      (SELECT title  FROM music_category WHERE music_category.cat_id=music.cat_id) as music_cat
      FROM music ORDER BY id desc`;
      // let teacherlist;
      await db.query(
        `SELECT * FROM teacher where teacher.isActive = "active"`,
        catchAsync(async (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost teacher");
            res.redirect("/");
            return console.log(error);
            // return next(new AppError("Something Went Wrong!", 400));
          } else {
            teacherlist = rows;
          }
        })
      );
      await db.query(
        `SELECT * FROM teacherGroup`,
        catchAsync(async (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost teacherGroup");
            res.redirect("/");
            return console.log(error);
            // return next(new AppError("Something Went Wrong!", 400));
          } else {
            group = rows;
          }
        })
      );
      await db.query(
        query,
        catchAsync(async (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost teacherGroup");
            res.redirect("/");
            return console.log(error);
            // return next(new AppError("Something Went Wrong!", 400));
          } else {
            res.render("admin/music-dashboard", {
              layout: "layoutadmin.hbs",
              message: req.flash("message"),
              activemusicdashboard: active,
              rows: rows,
              music_category: category,
              group,
              teacherlist,
              imagePath: req.session.admin.imagePath,
              username:
                req.session.admin.firstname + " " + req.session.admin.lastname,
              user: req.session.admin,
            });
          }
        })
      );
    } catch (error) {
      req.flash("message", "syntax Error Music dashboard");
      res.redirect("/");
      console.log(error);
    }
  })
);
// music upload end
// assign music start

router.post(
  "/assign-music",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let musicname;
    let musicUrl;
    let lastedit = standardDate.date();
    await db.query(
      `SELECT * from music where id IN (?)`,
      [req.body.musicname],
      async (error, MusicRows) => {
        if (error) {
          console.log(error);
          return;
        }
        if (req.body.cars === "3") {
          if (typeof req.body.teachername === "string") {
            db.query(
              "SELECT * FROM teacherGroup WHERE id=?",
              [req.body.teachername],
              async (error, rows) => {
                if (error) {
                  return console.log(error);
                }
                let teacherID = [];
                teacherID = rows[0];
                let teacheridArr = [];
                teacheridArr = JSON.parse(teacherID.teacherId).teacherids;
                for (var i in teacheridArr) {
                  let teacherid = teacheridArr[i];
                  await db.query(
                    "SELECT * FROM teacher WHERE id=?",
                    [JSON.parse(rows[0].teacherId).teacherids[i]],
                    async (error, rows) => {
                      if (error) {
                        return console.log(error);
                      }
                      let teacherData = rows[0].id;
                      let teachername = rows[0].firstname;
                      let teacheremail = rows[0].email;

                      const message = `<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=euc-jp">
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting">
        <title>Teacher When Assigned</title>
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
          <h1>Please Watch This Video for More Information: <a href="https://vimeo.com/751965999" target="_blank" >Click Here</a></h1>
            <table style="border-bottom: 2px solid  #6B0e3d;background-color: #6B0e3d;border-top-left-radius: 15px;border-top-right-radius: 15px; ">
                <tr><td align="center">
                        <img src="https://lhavin.com/images/logo-new.jpg" style="width: 163px; height: 94px; padding-top: 18px;">
                    </td></tr>
              
             
            </table>
            <table style="color: #000;font-size: 16px; text-align:justify;">
                <tr>
                    <td style="padding: 11px 17px; ">Dear ${teachername},</td>
                </tr>
                <tr>
                    <td style="padding: 4px 17px;">The COJDS team has given you access to a new resource in your teacher account: ${musicname}</td>
                </tr>
                <tr>
                    <td style="padding: 9px 17px; ">You will see this resource in the list of assigned music's next time you log in to the digital L havin platform at lhavin.com. If you are experiencing any issues, please contact our support staff.</td>
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
                        await sendEmail({
                          email: teacheremail,
                          subject: `Hi, music Assigned`,
                          message,
                        });
                      } catch (err) {
                        console.log(err);
                      }
                    }
                  );

                  await db.query(
                    `INSERT  IGNORE INTO assignmusic (assignBy, assignTo , teacherDescription, id,date) values (?,?,?,?,?)`,
                    [
                      "admin",
                      teacherid,
                      req.body.textarea,
                      req.body.musicname,
                      lastedit,
                    ],

                    (error, rows) => {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                }
              }
            );
          } else {
            console.log("selected multiple groups");
            for (var i in req.body.teachername) {
              let teachergroup = [];
              teachergroup = req.body.teachername[i];
              await db.query(
                "SELECT * FROM teacherGroup WHERE id=?",
                [req.body.teachername[i]],
                (error, rows) => {
                  if (error) {
                    return console.log(error);
                  }
                  let teacherID = [];
                  teacherID = JSON.parse(rows[0].teacherId).teacherids;

                  for (var i in teacherID) {
                    let teacherid = teacherID[i];
                    db.query(
                      "SELECT * FROM teacher WHERE id=?",
                      [teacherid],
                      async (error, rows) => {
                        if (error) {
                          return console.log(error);
                        }
                        let teacherData = rows[0];

                        const message = `<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=euc-jp">
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting">
        <title>Teacher When Assigned</title>
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
                    <td style="padding: 11px 17px; ">Dear ${teacherData[0].firstname},</td>
                </tr>
                <tr>
                    <td style="padding: 4px 17px;">The COJDS team has given you access to a new resource in your teacher account: ${musicname}</td>
                </tr>
                <tr>
                    <td style="padding: 9px 17px; ">You will see this resource in the list of assigned music's next time you log in to the digital L havin platform at lhavin.com. If you are experiencing any issues, please contact our support staff.</td>
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
                          await sendEmail({
                            email: teacherData[0].email,
                            subject: `Hi, music Assigned`,
                            message,
                          });
                        } catch (err) {
                          console.log(err);
                        }
                      }
                    );

                    let MusicList = MusicRows;
                    for (let mIdex = 0; mIdex < MusicList.length; mIdex++) {
                      const Musicelement = MusicList[mIdex];
                      musicUrl = Musicelement.musicurl;
                      musicname = Musicelement.musicurl;
                      let myMId = Musicelement.id;
                      // console.log("================", {
                      //   textarea: req.body.textarea,
                      //   techaername,
                      // });
                      db.query(
                        `INSERT  IGNORE INTO assignmusic (assignBy, assignTo , teacherDescription, id,date, musicName, musicurl) values (?,?,?,?,?,?,?)`,
                        [
                          "admin",
                          teachername,
                          req.body.textarea,
                          myMId,
                          musicname,
                          lastedit,
                          musicname,
                          musicUrl,
                        ],
                        (error, rows) => {
                          if (error) {
                            console.log(error);
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
          }
          res.redirect("/admin/music-dashboard");
        } else if (req.body.cars === "2") {
          assign_music_function = (teachername) => {
            teachername = parseInt(teachername);
            lastedit = standardDate.date();
            db.query(
              "SELECT * FROM teacher WHERE id=?",
              teachername,
              async (error, rows) => {
                if (error) {
                  console.log(error);
                }
                const message = `<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=euc-jp">
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting">
        <title>Teacher When Assigned</title>
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
                    <td style="padding: 11px 17px; ">Dear ${rows[0].firstname},</td>
                </tr>
                <tr>
                    <td style="padding: 4px 17px;">The COJDS team has given you access to a new resource in your teacher account: ${musicname}</td>
                </tr>
                <tr>
                    <td style="padding: 9px 17px; ">You will see this resource in the list of assigned music's next time you log in to the digital L havin platform at lhavin.com. If you are experiencing any issues, please contact our support staff.</td>
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
                  await sendEmail({
                    email: rows[0].email,
                    subject: `Hi, music Assigned`,
                    message,
                  });
                } catch (err) {
                  console.log(err);
                }
              }
            );

            let MusicList = MusicRows;
            for (let mIdex = 0; mIdex < MusicList.length; mIdex++) {
              const Musicelement = MusicList[mIdex];
              musicUrl = Musicelement.musicurl;
              musicname = Musicelement.musicurl;
              let myMId = Musicelement.id;
              // console.log("=-----------------", {
              //   textarea: req.body.textarea,
              //   techaername,
              // });
              db.query(
                `INSERT IGNORE INTO  assignmusic (assignBy, assignTo , teacherDescription, id,date, musicName, musicurl) values (?,?,?,?,?,?,?)`,
                [
                  "admin",
                  teachername,
                  req.body.textarea,
                  myMId,
                  musicname,
                  lastedit,
                  musicname,
                  musicUrl,
                ],
                (error, rows) => {
                  if (error) {
                    console.log(error);
                  }
                }
              );
            }
          };
          Array.isArray(req.body.teachername)
            ? req.body.teachername.map((teachername, i) => {
                assign_music_function(teachername);
              })
            : assign_music_function(req.body.teachername);
          res.redirect("/admin/music-dashboard");
        }
      }
    );
    let groupid = parseInt(req.body.teachername);
  })
);

// assign music end
router.post("/filter-music", async (req, res) => {
  const { cat_id } = req.body;
  let cat_id_list = cat_id ? cat_id.join(",") : "";

  // let sql = `SELECT * FROM music WHERE  cat_id=` + cat_id;
  let sql = `SELECT * FROM music WHERE  cat_id IN (${cat_id_list})`;
  await db.query(sql, (error, rows) => {
    if (error) {
      res.send({ status: false, msg: "Something went wrong ", error: error });
      return;
    } else {
      res.send({ status: false, msg: "", data: rows });
      return;
    }
  });
});

// let docid;

router.get("/get-sample-csv");
const csv = require("csv-parser");
var XLSX = require("xlsx");
const fastcsv = require("fast-csv");
const neatCsv = require("neat-csv");
router.post(
  "/csv-upload",
  catchAsync(async (req, res) => {
    try {
      let scount;
      let message = "";
      var selectedfile = req.files.pdf.data;
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
      var ext = path.extname(req.files.pdf.name);
      if (ext !== ".csv") {
        req.flash(
          "emessage",
          "Please Upload CSV in correct File Format as Sample Provided"
        );
        res.redirect("/admin/student-list");
        return;
      }
      const rand = Math.ceil(Math.random() * 1000);
      //Random pdf name with timeStamp so it will not overide previous images.
      let nameOfFileInDB = req.files.pdf.name;
      // const filenameOriginal = `${req.session.admin.firstname}.${req.files.pdf[i].name}`;
      const filenameOriginal = `${req.files.pdf.name}`;
      const remsp = filenameOriginal.split(" ").join("_");
      const fileName = remsp;
      let abc = "abc";
      path3 = path.resolve(`./public/csv`);
      let localpath = `${path3}/`;

      if (!fs.existsSync(localpath)) {
        fs.mkdirSync(localpath);
      }

      fs.writeFileSync(`${localpath}` + fileName, imageBuffer, "utf8");

      ip = url1;
      const url = `${ip}/csv/${fileName}`;
      const filePath = `./public/csv/${fileName}`.toString();
      const filepath1 = filePath.toString();

      fs.readFile(`${filepath1}`, async (err, data) => {
        if (err) {
          return console.error(err);
        }

        let ArrData = [];

        let fcounter = 0;
        ArrData = await neatCsv(data);
        ArrData1 = await neatCsv(data);
        ArrDataCopy = await neatCsv(data);
        // let noError = false;

        let dataR = [];
        for (r = 0; r < ArrData.length; r++) {
          if (r || r === 0) {
            await TestFunc2(r);
          }
        }

        async function TestFunc2(r) {
          db.query(
            `SELECT * FROM teacher where teacher.isActive = "active" and schoolid = ? and id=?`,
            [ArrData[r].schoolid, ArrData[r].teacherid],
            async (error, rows) => {
              // console.log("if");
              if (error) {
                console.log(error);
              }
              // console.log("length: " + rows.length);
              let length = rows.length;
              // console.log(r);
              if (length === 0) {
                // console.log("inside if first");
                noError = false;
                noTeacher = false;
                j = parseInt(r) + 1;
                // console.log(i, j);
                ArrData = [];
                req.flash(
                  "emessage",
                  "Failed to insert Records, School of Student is Different From School of Teacher at location: " +
                    j
                );
                res.redirect("/admin/student-list");
                return;
              } else {
                noError = true;
                let g = parseInt(ArrData.length) - 1;
                let h = parseInt(g);
                //  console.log("Above TestFunc1: ", i, ArrData.length, h);
                // console.log(!rows.length < 0);
                // console.log(r, h);

                if (parseInt(r) === parseInt(h)) {
                  // console.log("inside if above TestFunc1");
                  TestFunc1();
                  ArrData = [];
                }
              }

              // if (parseInt(i) == parseInt(h) && parseInt(rows.length) > 0) {
              //   console.log("inside if above TestFunc1");
              //   TestFunc1();
              //   ArrData = [];
              // }
            }
          );
        }
        async function TestFunc1() {
          // console.log("Inside TestFunct 1");
          for (var i in ArrData1) {
            // console.log(i, ArrData1.length - 1);
            // console.log("inside 2nd for", noTeacher);

            if (ArrData1[i].firstname == "" || ArrData1[i].lastname == "") {
              // console.log("i -> ", i);
              let j = parseInt(i) + 2;
              noError = false;
              noTeacher = false;
              req.flash(
                "emessage",
                "Failed to Insert " +
                  ArrData1.length +
                  " Records," +
                  " Miss ing FIrstname or Lastname  at location: ",
                j
              );
              // //console.log(j);
              return res.redirect("/admin/student-list");
            } else if (ArrData1[i].schoolid == "") {
              noError = false;
              noTeacher = false;
              // // console.log("i -> ", i);
              req.flash(
                "emessage",
                "Failed to Insert " +
                  ArrData1.length +
                  " Records," +
                  "Missing Schoolid  at location: ",
                ++i
              );

              return res.redirect("/admin/student-list");
            } else if (ArrData1[i].classid == "") {
              noTeacher = false;
              noError = false;
              // console.log("i -> ", i);
              req.flash(
                "emessage",
                "Failed to Insert " +
                  ArrData1.length +
                  " Records," +
                  "Missing classid at location: ",
                ++i
              );
              return res.redirect("/admin/student-list");
              //continue;
            } else if (ArrData1[i].teacherid == "") {
              noError = false;
              // //console.log("i -> ", i);
              req.flash(
                "emessage",
                "Failed to Insert " +
                  ArrData1.length +
                  " Records," +
                  "Missing teacherid at location: ",
                ++i
              );
              return res.redirect("/admin/student-list");
              //continue;
            } else {
              // console.log("inside last else ");

              let n = parseInt(ArrData1.length) - 1;
              // console.log("n: ", n);
              // console.log(i, ArrData1.length);
              // console.log("noTeacher: " + noTeacher);
              if (i == n) {
                // console.log(i, n);
                testFunc((noError = true));
                ArrData1 = [];
                break;
              }
            }
          }
        }

        async function testFunc(noError) {
          // console.log("inside testFunc");
          // console.log(noError);
          let scounter = 0;
          if (noError) {
            // console.log("IF nOERROR");
            for (k = 0; k < ArrDataCopy.length; k++) {
              let normalemail =
                ArrDataCopy[k]["Email OR Username"] === "" ? true : false;
              let email =
                ArrDataCopy[k]["Email OR Username"] === ""
                  ? `${ArrDataCopy[k].firstname}` + `${ArrDataCopy[k].lastname}`
                  : ArrDataCopy[k]["Email OR Username"];
              let password =
                ArrDataCopy[k].password === ""
                  ? `${ArrDataCopy[k].firstname}` + `${ArrDataCopy[k].lastname}`
                  : ArrDataCopy[k].password;
              let enrollmentnumber =
                ArrDataCopy[k].enrollmentnumber === ""
                  ? "NA"
                  : ArrDataCopy[k].enrollmentnumber;
              // let countrycode =
              //   ArrDataCopy[i].countrycode === "" ? "+1" : "+" + ArrDataCopy[i].countrycode;
              let mobile =
                ArrDataCopy[k].mobile === "" ? "NA" : ArrDataCopy[k].mobile;

              let create_time = standardDate.date();
              //console.log(create_time);
              await db.query(
                "INSERT INTO student (email,password,firstname,lastname,create_time,schoolid,classid,teacherid,enrollmentnumber,mobile,role,isActive) values (?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                  email,
                  password,
                  ArrDataCopy[k].firstname,
                  ArrDataCopy[k].lastname,
                  create_time,
                  ArrDataCopy[k].schoolid,
                  ArrDataCopy[k].classid,
                  ArrDataCopy[k].teacherid,
                  enrollmentnumber,
                  mobile,
                  "student",
                  "active",
                ],
                async (error, rows, results) => {
                  if (error) {
                    console.log("ERROR: ", error);
                  }

                  // console.log("insertid: ", rows);
                  //  if (!error) {
                  scounter = scounter + 1;
                  scount = parseInt(scounter);
                  //  }
                  // scounter = scounter + 1;
                  // scount = scounter;
                  //console.log("scounter: ", scounter, scount);
                  if (normalemail) {
                    await db.query(
                      "UPDATE student SET email=? WHERE id=?",
                      [email + rows.insertId, rows.insertId],
                      (error, rows) => {
                        if (error) {
                          // console.log(error);
                        }
                        //console.log("inside update query");
                        //console.log(rows);
                      }
                    );
                  }
                }
              );
              //  } //FOR ENDS HERE
            }
            //console.log("counter   ", k);
            pmessage =
              "Records Inserted Successfully, Total Accounts Created: " + k;

            let m = this.pmessage;
            // console.log(this.pmessage, pmessage);
            //console.log("m:  ", m, k);
            req.flash("message", pmessage);
            res.redirect("/admin/student-list");
            return;
          }
          return;
        }
      });
    } catch (e) {}
  })
);

// bulk upload
router.post(
  "/csv_student_upload",
  catchAsync(async (req, res, next) => {
    // console.log("1");
    let scount;
    let message = "";
    //console.log(req.files);
    var selectedfile = req.files.pdf.data;
    let returnedB64 = Buffer.from(selectedfile).toString("base64");
    // console.log("2");
    //console.log(returnedB64);
    //console.log(req.session.admin);
    //const url1 = req.protocol + "://" + req.get("host");
    const url1 = "https://lhavin.com";
    var matches = returnedB64;
    response = {};
    //console.log(matches);
    response.type = matches;
    //console.log(response.type);
    response.data = new Buffer.from(matches, "base64");
    // console.log("3");
    let decodedImg = response;
    //console.log("response", decodedImg.data, decodedImg.type);
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    const name = type.split("/");
    //console.log(name);
    // console.log(type);
    const name1 = name[0];
    console.log("4");
    //console.log(name1);
    // let extension = mime.getExtension(type);
    // let ext = mime.getExtension(req.files.pdf.name);
    // console.log("ext:", ext);
    var ext = path.extname(req.files.pdf.name);
    //console.log(ext);
    if (ext !== ".csv") {
      req.flash(
        "emessage",
        "Please Upload CSV in correct File Format as Sample Provided"
      );
      res.redirect("/admin/student-list");
      return;
    }
    console.log("5");

    // console.log("extension:", extension);
    const rand = Math.ceil(Math.random() * 1000);
    //Random pdf name with timeStamp so it will not overide previous images.
    let nameOfFileInDB = req.files.pdf.name;
    //console.log("nameofiles :" + nameOfFileInDB);
    // const filenameOriginal = `${req.session.admin.firstname}.${req.files.pdf[i].name}`;
    const filenameOriginal = `${req.files.pdf.name}`;
    //console.log("index:" + filenameOriginal);
    const remsp = filenameOriginal.split(" ").join("_");
    const fileName = remsp;
    //console.log("filename:" + fileName);
    console.log("6");
    let abc = "abc";
    path3 = path.resolve(`./public/csv`);
    let localpath = `${path3}/`;
    console.log("7");
    if (!fs.existsSync(localpath)) {
      fs.mkdirSync(localpath);
    }
    console.log("8");
    fs.writeFileSync(`${localpath}` + fileName, imageBuffer, "utf8");
    // console.log(localpath + fileName);
    console.log("9");
    ip = url1;
    //console.log(ip);
    const url = `${ip}/csv/${fileName}`;
    const filePath = `./public/csv/${fileName}`.toString();
    const filepath1 = filePath.toString();
    fs.readFile(`${filepath1}`, async (err, data) => {
      if (err) {
        return console.error(err);
      }

      let ArrData = [];

      let fcounter = 0;
      ArrData = await neatCsv(data);
      ArrData1 = await neatCsv(data);
      ArrDataCopy = await neatCsv(data);
      // let noError = false;
      let AlreadyAval2 = [];
      console.log("10");
      let dataR = [];
      for (r = 0; r < ArrData.length; r++) {
        console.log(r);
        //TestFunc2(r);
        if (r || r === 0) {
          console.log("b: ", r);
          await TestFunc1(r);
        }
      }
      console.log("11");
      async function TestFunc1() {
        console.log("12");
        for (var i in ArrData1) {
          if (ArrData1[i].schoolName == "") {
            let j = parseInt(i) + 2;
            noError = false;
            noTeacher = false;
            req.flash(
              "emessage",
              "Failed to Insert " +
                ArrData1.length +
                " Records," +
                " Miss ing FIrstname or Lastname  at location: ",
              j
            );
            console.log("12");
            // //console.log(j);
            return res.redirect("/admin/manage-schools");
          } else {
            let n = parseInt(ArrData1.length) - 1;
            if (i == n) {
              // console.log(i, n);
              testFunc((noError = true));
              ArrData1 = [];
              break;
            }
          }
        }
      }
      console.log("13");
      async function testFunc(noError) {
        let scounter = 0;
        if (noError) {
          for (k = 0; k < ArrDataCopy.length; k++) {
            let schoolName = ArrDataCopy[k].schoolName;
            await apiFunctionWrapper(schoolName);
          }
          console.log("14");
          // console.log("AlreadyAval2AlreadyAval22",AlreadyAval2)
          function apiFunction(schoolName, successCallback, errorCallback) {
            db.query(
              `SELECT * from school where schoolName=?`,
              [schoolName],
              async (error, rows) => {
                if (error) {
                  console.log(error);
                  errorCallback(error);
                }
                if (rows.length > 0) {
                  AlreadyAval2.push(schoolName);
                  successCallback(true);
                } else {
                  db.query(
                    "INSERT INTO school (schoolName,isActive) values (?,?)",
                    [schoolName, "active"],
                    async (error, rows, results) => {
                      if (error) {
                        console.log("ERROR: ", error);
                        errorCallback(error);
                      }

                      scounter = scounter + 1;
                      scount = parseInt(scounter);
                      successCallback(true);
                    }
                  );
                }
              }
            );
          }
          console.log("15");
          function apiFunctionWrapper(schoolName) {
            return new Promise((resolve, reject) => {
              apiFunction(
                schoolName,
                (successResponse) => {
                  resolve(successResponse);
                },
                (errorResponse) => {
                  reject(errorResponse);
                }
              );
            });
          }
          console.log("16");
          //console.log("counter   ", k);
          let pmessage = "Records Inserted Successfully,";
          "\nTotal Records Inserted:" + k - AlreadyAval2.length + "";
          //  console.log("AlreadyAval2.lengthAlreadyAval2.length",AlreadyAval2.length)
          if (AlreadyAval2.length > 0) {
            pmessage +=
              "Total Records Not Inserted:" +
              AlreadyAval2.length +
              AlreadyAval2.join(", ");
          }
          // console.log("AlreadyAval2AlreadyAval2",AlreadyAval2)
          console.log("17");
          let m = this.pmessage;
          // console.log(this.pmessage, pmessage);
          //console.log("m:  ", m, k);
          req.flash("message", pmessage);
          res.redirect("/admin/manage-schools");
          return;
        }

        return;
      }
    });
  })
);
//  !! Student List Start
router.post(
  "/add-student",
  catchAsync(async (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email == "" ? firstname + lastname : req.body.email;
    let password =
      req.body.password == "" ? firstname + lastname : req.body.password;
    let mobile = req.body.mobile == "" ? "NA" : req.body.mobile;
    let schoolid = req.body.schoolid;
    let teacherid = req.body.teacherid;
    let classid = req.body.classid;
    let enrollmentnumber =
      req.body.enrollmentnumber == "" ? "NA" : req.body.enrollmentnumber;
    let create_time = standardDate.date();
    try {
      await db.query(
        "INSERT into student (firstname,lastname,email,password,mobile,schoolid,teacherid,classid,enrollmentnumber,create_time)  values (?,?,?,?,?,?,?,?,?,?)",
        [
          firstname,
          lastname,
          email,
          password,
          mobile,
          schoolid,
          teacherid,
          classid,
          enrollmentnumber,
          create_time,
        ],
        catchAsync(async (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost student");
            res.redirect("/");
            return console.log(error);
          }
          if (req.body.email == "") {
            await db.query(
              "UPDATE student SET email=? WHERE id=?",
              [email + rows.insertId, rows.insertId],
              (error) => {
                if (error) {
                  req.flash(
                    "message",
                    "Database connection lost Update student"
                  );
                  res.redirect("/");
                  return console.log(error);
                }
              }
            );
          }
          res.redirect("/admin/student-list");
        })
      );
    } catch (error) {
      req.flash("message", "Syntax Error");
      res.redirect("/");
      console.log(error);
    }
  })
);

router.get("/student-list", isLoggedIn, async function (req, res) {
  let active;
  let Active = "active";
  if (req.url === "/student-list") {
    active = "active";
  } else active = "";
  try {
    db.query("SELECT * FROM school", (error, rows) => {
      if (error) {
        req.flash("message", "Database connection lost  school");
        res.redirect("/");
        return console.error(error.message);
      } else {
        let school_data = rows;
        db.query("SELECT * FROM class", (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost school");
            res.redirect("/");
            return console.error(error.message);
          } else {
            let class_data = rows;
            db.query("SELECT * FROM teacher", (error, rows) => {
              if (error) {
                req.flash("message", "Database connection lost school");
                res.redirect("/");
                return console.error(error.message);
              } else {
                let teacher_data = rows;
                let query =
                  "SELECT st.*,(SELECT COUNT(*) FROM `assignPdf` WHERE assignToStudent = st.id) AS TotalAsign,(select firstname from teacher where id = st.teacherid) AS teacher_name,(select schoolName from school where id = st.schoolid) AS school_name,(select className from class where id = st.classid) AS class_name FROM `student` AS st order by st.id desc";
                db.query(query, (error, rows) => {
                  if (error) {
                    req.flash("message", "Database connection lost school");
                    res.redirect("/");
                    return console.error(error.message);
                  } else {
                    totalItems = rows && rows.length;
                    res.render("admin/student-list", {
                      layout: "layoutadmin.hbs",
                      activestudentlist: active,

                      message: req.flash("message"),
                      emessage: req.flash("emessage"),
                      Active,
                      rows: rows,
                      imagePath: req.session.admin.imagePath,
                      username:
                        req.session.admin.firstname +
                        " " +
                        req.session.admin.lastname,
                      user: req.session.admin,
                      class_data,
                      teacher_data,
                      school_data,
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } catch (error) {
    req.flash("message", "Syntax Error");
    res.redirect("/");
    console.log(error);
  }
});

router.post(
  "/assign-pdf",
  isLoggedIn,
  catchAsync(async (req, res) => {
    // const pdfNames = req.body.pdfname;
    // const pdfNameFormate = pdfNames ? pdfNames.join(",") : "";
    let pdfname = [];
    let lastedit = standardDate.date();
    await db.query(
      // `SELECT * from pdf where pdfid=?`,
      `SELECT * from pdf where pdfid IN (?)`,
      [req.body.pdfname],
      (error, rows) => {
        if (error) {
          return console.log(error);
        }
        rows.forEach((item) => pdfname.push(item.pdfname));

        // pdfname = rows[0].pdfname;
      }
    );
    let groupid = parseInt(req.body.teachername);
    if (req.body.cars === "3") {
      if (typeof req.body.teachername === "string") {
        db.query(
          "SELECT * FROM teacherGroup WHERE id=?",
          [req.body.teachername],
          async (error, rows) => {
            if (error) {
              return console.log(error);
            }
            let teacherID = [];
            teacherID = rows[0];
            //console.log(rows);
            // console.log(JSON.parse(teacherID.teacherId).teacherids);
            let teacheridArr = [];
            teacheridArr = JSON.parse(teacherID.teacherId).teacherids;
            // console.log("teacheridarr: ", teacheridArr);
            for (var i in teacheridArr) {
              // console.log("teacheridarr: ", teacheridArr[i]);
              let teacherid = teacheridArr[i];
              // console.log("teacherID: ", teacherid);
              await db.query(
                "SELECT * FROM teacher WHERE id=?",
                [JSON.parse(rows[0].teacherId).teacherids[i]],
                async (error, rows) => {
                  if (error) {
                    return console.log(error);
                  }
                  //console.log(rows);
                  let teacherData = rows[0].id;
                  let teachername = rows[0].firstname;
                  // let teacheremail = rows[0].email;

                  //const message = `<p>Dear ${teachername},`;
                  const message = `<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=euc-jp">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Teacher When Assigned</title>
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
      <h1>Please Watch This Video for More Information: <a href="https://vimeo.com/751965999" target="_blank" >Click Here</a></h1>
        <table style="border-bottom: 2px solid  #6B0e3d;background-color: #6B0e3d;border-top-left-radius: 15px;border-top-right-radius: 15px; ">
            <tr><td align="center">
                    <img src="https://lhavin.com/images/logo-new.jpg" style="width: 163px; height: 94px; padding-top: 18px;">
                </td></tr>
          
         
        </table>
        <table style="color: #000;font-size: 16px; text-align:justify;">
            <tr>
                <td style="padding: 11px 17px; ">Dear ${teachername},</td>
            </tr>
            <tr>
                <td style="padding: 4px 17px;">The COJDS team has given you access to a new resource in your teacher account: ${pdfname}</td>
            </tr>
            <tr>
                <td style="padding: 9px 17px; ">You will see this resource in the list of assigned PDFs next time you log in to the digital L havin platform at lhavin.com. If you are experiencing any issues, please contact our support staff.</td>
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
                }
              );
              // console.log("date", lastedit, standardDate);

              await db.query(
                `INSERT IGNORE INTO assignPdf (assignBy, assignTo , teacherDescription, pdfid,date) values (?,?,?,?,?)`,
                [
                  "admin",
                  teacherid,
                  req.body.textarea,
                  req.body.pdfname,
                  lastedit,
                ],

                (error, rows) => {
                  if (error) {
                    console.log(error);
                  }
                  // console.log(rows);
                }
              );
            }
          }
        );
      } else {
        // console.log("selected multiple groups");
        for (var i in req.body.teachername) {
          let teachergroup = [];
          teachergroup = req.body.teachername[i];
          //console.log(teachergroup);
          await db.query(
            "SELECT * FROM teacherGroup WHERE id=?",
            [req.body.teachername[i]],
            (error, rows) => {
              if (error) {
                return console.log(error);
              }
              let teacherID = [];
              teacherID = JSON.parse(rows[0].teacherId).teacherids;
              //console.log(rows);
              // console.log(JSON.parse(teacherID.teacherId).teacherids);
              for (var i in teacherID) {
                // console.log(teacherID);
                let teacherid = teacherID[i];
                // console.log(teacherid);
                db.query(
                  "SELECT * FROM teacher WHERE id=?",
                  [teacherid],
                  async (error, rows) => {
                    if (error) {
                      return console.log(error);
                    }

                    const message = `<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=euc-jp">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Teacher When Assigned</title>
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
      <h1>Please Watch This Video for More Information: <a href="https://vimeo.com/751965999" target="_blank" >Click Here</a></h1>
        <table style="border-bottom: 2px solid  #6B0e3d;background-color: #6B0e3d;border-top-left-radius: 15px;border-top-right-radius: 15px; ">
            <tr><td align="center">
                    <img src="https://lhavin.com/images/logo-new.jpg" style="width: 163px; height: 94px; padding-top: 18px;">
                </td></tr>
          
         
        </table>
        <table style="color: #000;font-size: 16px; text-align:justify;">
            <tr>
                <td style="padding: 11px 17px; ">Dear ${teacherData[0].firstname},</td>
            </tr>
            <tr>
                <td style="padding: 4px 17px;">The COJDS team has given you access to a new resource in your teacher account: ${pdfname}</td>
            </tr>
            <tr>
                <td style="padding: 9px 17px; ">You will see this resource in the list of assigned PDFs next time you log in to the digital L havin platform at lhavin.com. If you are experiencing any issues, please contact our support staff.</td>
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
                      console.log("Sending mail...");
                      await sendEmail({
                        // email: teacherData[0].email,
                        subject: `Hi, PDf Assigned`,
                        //  subject: 'Your password reset token (valid for 10 min)',
                        message,
                      });
                    } catch (err) {
                      console.log(err);
                    }
                  }
                );
                // console.log("date", lastedit, standardDate);
                console.log(
                  "-----------------------",
                  teacherid,
                  req.body.textarea,
                  req.body.pdfname,
                  lastedit
                );
                db.query(
                  `INSERT IGNORE INTO assignPdf (assignBy, assignTo , teacherDescription, pdfid,date) values (?,?,?,?,?)`,
                  [
                    "admin",
                    teacherid,
                    req.body.textarea,
                    req.body.pdfname,
                    lastedit,
                  ],

                  (error, rows) => {
                    if (error) {
                      console.log(error);
                    }
                    // console.log(rows);
                  }
                );
              }
            }
          );
        }
      }
      res.redirect("/admin/pdf-dashboard");
    } else if (req.body.cars === "2") {
      console.log("in else");
      assign_pdf_function = (teachername) => {
        teachername = parseInt(teachername);
        lastedit = standardDate.date();
        db.query(
          "SELECT * FROM teacher WHERE id=?",
          teachername,
          async (error, rows) => {
            if (error) {
              console.log(error);
            }
            //const message = `<p>Dear ${rows[0].firstname}`;
            const message = `<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=euc-jp">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Teacher When Assigned</title>
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
      <h1>Please Watch This Video for More Information: <a href="https://vimeo.com/751965999" target="_blank" >Click Here</a></h1>
        <table style="border-bottom: 2px solid  #6B0e3d;background-color: #6B0e3d;border-top-left-radius: 15px;border-top-right-radius: 15px; ">
            <tr><td align="center">
                    <img src="https://lhavin.com/images/logo-new.jpg" style="width: 163px; height: 94px; padding-top: 18px;">
                </td></tr>
          
         
        </table>
        <table style="color: #000;font-size: 16px; text-align:justify;">
            <tr>
                <td style="padding: 11px 17px; ">Dear ${rows[0].firstname},</td>
            </tr>
            <tr>
                <td style="padding: 4px 17px;">The COJDS team has given you access to a new resource in your teacher account: ${pdfname}</td>
            </tr>
            <tr>
                <td style="padding: 9px 17px; ">You will see this resource in the list of assigned PDFs next time you log in to the digital L havin platform at lhavin.com. If you are experiencing any issues, please contact our support staff.</td>
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
              console.log("Sending mail...");
              await sendEmail({
                email: rows[0].email,
                subject: `Hi, PDf Assigned`,
                //  subject: 'Your password reset token (valid for 10 min)',
                message,
              });
            } catch (err) {
              console.log(err);
            }
          }
        );

        if (typeof req.body.pdfname === "object") {
          req.body.pdfname.forEach(function (pdf) {
            db.query(
              `INSERT IGNORE INTO assignPdf (assignBy, assignTo , teacherDescription, pdfid,date) values (?,?,?,?,?)`,
              ["admin", teachername, req.body.textarea, pdf, lastedit],
              (error, rows) => {
                if (error) {
                  console.log(error);
                }
                // console.log(rows);
              }
            );
          });
        } else {
          db.query(
            `INSERT IGNORE INTO assignPdf (assignBy, assignTo , teacherDescription, pdfid,date) values (?,?,?,?,?)`,
            [
              "admin",
              teachername,
              req.body.textarea,
              req.body.pdfname,
              lastedit,
            ],
            (error, rows) => {
              if (error) {
                console.log(error);
              }
              // console.log(rows);
            }
          );
        }
      };
      Array.isArray(req.body.teachername)
        ? req.body.teachername.map((teachername, i) => {
            assign_pdf_function(teachername);
          })
        : assign_pdf_function(req.body.teachername);
      res.redirect("/admin/pdf-dashboard");
    }
  })
);
//  !! Student List End
router.post("/delete-group", (req, res) => {
  let deleetdatafromteacherGroup = "DELETE FROM teacherGroup WHERE id=?";
  let dataid = [req.body.id];
  db.query(deleetdatafromteacherGroup, dataid, (error) => {
    if (error) {
      return console.log(error);
    }
    req.flash("message", "Teacher Group Deleted Successfully");
    res.redirect("/admin/teacher-group");
  });
});

router.post("/change-pdf-status", isLoggedIn, (req, res) => {
  if (req.body.status === "active") {
    let changestatus = "UPDATE pdf set isActive=? WHERE id=?";
    let dataid = ["inactive", req.body.id];

    db.query(changestatus, dataid, (error, rows, fields) => {
      if (error) {
        return console.error(error.message);
      }
      //console.log("Rows affected:", rows);
      //return alert("This is alert box!");
      res.redirect("/admin/teacher-list");
    });
  } else {
    // console.log("false");
    let changestatus = "UPDATE pdf set isActive=? WHERE id=?";
    let dataid = ["active", req.body.id];
    //let data = ["student"];

    db.query(changestatus, dataid, (error, rows, fields) => {
      if (error) {
        return console.error(error.message);
      }
      ///console.log("Rows affected:", rows);
      db.query(
        "SELECT * FROM pdf WHERE id=?",
        [req.body.id],
        async (error, rows) => {
          if (rows) {
            //  console.log("email : " + rows[0].email);
            const message = `<p>Your Account is Activated! Login to access your account</p>`;

            try {
              await sendEmail({
                email: rows[0].email,
                subject: `Your Account is Activated! Login to access your account`,
                //  subject: 'Your password reset token (valid for 10 min)',
                message,
              });
              res.redirect("/admin/teacher-list"); //flash msg remaining
            } catch (err) {
              // console.log(err);
            }
          }
        }
      );
      //return alert("This is alert box!");
      // res.redirect("/admin/teacher-list");
    });
  }
});

router.post("/delete-pdf", isLoggedIn, (req, res) => {
  let deletedata = "DELETE FROM pdf WHERE pdfid=?";
  let deleetdatafromAssigpdf = "DELETE FROM assignPdf WHERE pdfid=?";
  let dataid = [req.body.id];

  db.query(deletedata, dataid, (error, rows, fields) => {
    if (error) {
      return console.error(error.message);
    }
    db.query(deleetdatafromAssigpdf, dataid, (error, rows) => {
      if (error) {
        return console.log(error);
      }
      req.flash("message", "PDF Deleted Successfully");
      res.redirect("/admin/pdf-dashboard");
    });

    //console.log("Rows affected:", rows);
    //return alert("This is alert box!");
  });
});

router.get("/editting-history-teacher/:id", isLoggedIn, (req, res) => {
  let teacherid = req.params.id;

  lastedit = standardDate.date();

  db.query(
    `SELECT * FROM teacher WHERE teacher.id = ${teacherid}`,
    (error, rows) => {
      if (error) {
        return console.log("error", error);
      }
      let taechername = rows[0].firstname + " " + rows[0].lastname;
      db.query(
        `SELECT ap.*,p.* FROM assignPdf AS ap,pdf AS p WHERE ap.assignTo = ${teacherid} AND ap.pdfid = p.pdfid ORDER BY ap.assignid desc`,
        (error, rows) => {
          if (error) {
            return console.log("error", error);
          }
          // console.log("result1", rows);
          let assignPdf = rows;

          db.query(
            `SELECT p.*,peh.date AS pehdate,peh.time AS pehtime,ap.*,t.firstname,t.lastname FROM pdf AS p, pdfEditHistoryByMember AS peh,assignPdf AS ap,teacher AS t WHERE peh.memberid = "${teacherid}" AND p.pdfid = peh.pdfid AND ap.assignid = peh.assignPdf_id AND peh.memberid = t.id ORDER BY peh.id desc`,
            (error, rows) => {
              if (error) {
                return console.log("error", error);
              }
              // console.log("result2", rows);
              const newResult = {};
              rows.forEach((result) => {
                if (newResult[result.pdfid]) {
                  newResult[result.pdfid].push(result);
                } else {
                  newResult[result.pdfid] = [result];
                }
              });
              const newResultPdfId = Object.keys(newResult).map((row) => ({
                id: row,
              }));
              res.render("admin/editting-history-teacher", {
                layout: "layoutadmin.hbs",
                edit_history: rows,
                assignPdf,
                newResult,
                newResultPdfId,
                imagePath: req.session.admin.imagePath,
                taechername,
                username:
                  req.session.admin.firstname +
                  " " +
                  req.session.admin.lastname,
              });
            }
          );
        }
      );
    }
  );
});

router.get("/teacher-list", isLoggedIn, function (req, res) {
  try {
    const page = parseInt(req.query.page) || 3;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    Handlebars.registerHelper("isdefined", function (value) {
      return value !== undefined;
    });
    let active;
    if (req.url === "/teacher-list") {
      active = "active";
    } else active = "";

    let query = `SELECT t.*,s.schoolName,(SELECT COUNT(*) FROM assignPdf WHERE assignTo = t.id) AS TotalAsign, (SELECT COUNT(*) FROM assignPdf WHERE assignTo = t.id AND lasteditByTeacher!='') AS totalEdits FROM teacher AS t,school AS s WHERE t.schoolid = s.id  order by t.id desc`;
    db.query("SELECT * FROM school", (error, rows) => {
      if (error) {
        req.flash("message", "Database connection lost shoolName");
        res.redirect("/");
        return console.error(error.message);
      } else {
        let school = rows;
        db.query(query, (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost shoolName");
            res.redirect("/");
            return console.error(error.message);
          } else {
            res.render("admin/teacher-list", {
              layout: "layoutadmin.hbs",
              rows,
              school,
              message: req.flash("message"),
              activeteacherlist: active,
              imagePath: req.session.admin.imagePath,
              username:
                req.session.admin.firstname + " " + req.session.admin.lastname,
              user: req.session.admin,
            });
          }
        });
      }
    });
  } catch (e) {
    req.flash("message", "Syntax Error");
    res.redirect("/");
    console.log(e);
  }
});

router.get("/teacher-list-paginate", function (req, res) {
  try {
    Handlebars.registerHelper("isdefined", function (value) {
      return value !== undefined;
    });
    let active;
    if (req.url === "/teacher-list-paginate") {
      active = "active";
    } else active = "";

    let query = `
    SELECT t.*,s.schoolName,(SELECT COUNT(*) FROM assignPdf WHERE assignTo = t.id) AS TotalAsign, (SELECT COUNT(*) FROM assignPdf WHERE assignTo = t.id AND lasteditByTeacher!='') AS totalEdits FROM teacher AS t,school AS s WHERE t.schoolid = s.id order by t.id DESC;`;
    db.query("SELECT * FROM school", (error, rows) => {
      if (error) {
        req.flash("message", "Database connection lost shoolName");
        res.redirect("/");
        return console.error(error.message);
      } else {
        let school = rows;
        db.query(query, (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost shoolName");
            res.redirect("/");
            return console.error(error.message);
          } else {
            let dataArr = [];
            for (let index = 0; index < rows.length; index++) {
              const element = rows[index];
              const {
                id,
                isActive,
                workbooks,
                TotalAsign,
                books,
                JudaicEmail,
                firstname,
                schoolName,
                email,
                lastname,
                schoolid,
                JudaicName,
                totalEdits,
              } = element;
              let btn =
                isActive === "active"
                  ? `<button class="badge badge-success" name="status"
              value="${isActive}">${isActive}</button>`
                  : `<button class="badge badge-danger" name="status"
              value="${isActive}">${isActive}</button>`;
              let yAndN = totalEdits ? `<p>Y</p>` : `<p>N</p>`;
              let schlList = JSON.stringify(school);

              schlList = schlList.replace(/'/g, "❜");

              for (let si = 0; si < school.length; si++) {
                const scl = school[si];
                // schlList += `<option value="${scl.id}">${scl.schoolName}</option>`;
              }
              let obj = {
                ...element,
                full_name: firstname + " " + lastname,
                // data-target="#con-close-modal"
                action:
                  `
                <table>
                <tr>
                  <td> 
                  <input type="hidden" id="id_int_${id}"  value="${id}" />
                  <input type="hidden" id="active_${id}"  value="${isActive}" />
                  <input type="hidden" id="workbooks_${id}"  value="${workbooks}" />
                  <input type="hidden" id="TotalAsign_${id}"  value="${TotalAsign}" />
                  <input type="hidden" id="books_${id}"  value="${books}" />
                  <input type="hidden" id="JudaicEmail_${id}"  value="${JudaicEmail}" />
                  <input type="hidden" id="firstname_${id}"  value="${firstname}" />
                  <input type="hidden" id="schoolName_${id}"  value="${schoolName}" />
                  <input type="hidden" id="email_${id}"  value="${email}" />
                  <input type="hidden" id="lastname_${id}"  value="${lastname}" />
                  <input type="hidden" id="schoolid_${id}"  value="${schoolid}" />
                  <input type="hidden" id="JudaicName_${id}"  value="${JudaicName}" />
                  <input type="hidden" id="totalEdits_${id}"  value="${totalEdits}" />
                  <button class="edit-btn btn-xs zz-modal con-close-modal"
                        onclick="openEditModal(this,` +
                  id +
                  `)"

                  data-id='${schlList}'
                      >Edit</button></td>
                  <td>
                    <form id="form3" action="/admin/delete-teacher" method="POST">
                      <input type="hidden" name="id" id="deleteteacher" value="${id}">
                      <button class="delete-btn fa fa-trash-o" style="color: red;"></button>
                    </form>
                  </td>
                  <td>
                    <a href="/admin/editting-history-teacher/${id}" target="_blank">
                      <button class="delete-btn">Logs</button>
                    </a>
                  </td>
                </tr>
              </table>
       
                
              <script type="text/javascript">
              $(document).ready(function () { $('.multipleselect').select2({
              placeholder: "school Name" }); });
            </script>
          
              `,
                isActive: `
                <form id="form4" action="/admin/change-teacher-status" method="POST">
                <input type="hidden" name="id" id="teacherstatus" value="${id}">  
                  ${btn}
                </form>
                
                `,
                TotalAsign: `<form id="form6" action="/admin/assigned-pdf-teacher-view" method="POST">
                <input type="hidden" name="id" id="idu" value="${id}">
                <button type="submit" class="" id="idu" name="teacherid">${TotalAsign}</button>
                ${yAndN}
              </form>`,
              };
              dataArr.push(obj);
              // console.log(element);
            }
            res.send({ data: dataArr });
          }
        });
      }
    });
  } catch (e) {
    req.flash("message", "Syntax Error");
    res.redirect("/");
    console.log(e);
  }
});

router.get("/teacher-group", isLoggedIn, function (req, res) {
  Handlebars.registerHelper("isdefined", function (value) {
    return value !== undefined;
  });
  let active;
  if (req.url === "/teacher-group") {
    active = "active";
  } else active = "";

  let query = `SELECT * FROM teacher where teacher.isActive = "active"`;
  try {
    db.query(`SELECT * FROM teacherGroup`, (error, rows) => {
      if (error) {
        req.flash("message", "Database connection lost Teacher");
        res.redirect("/");
        return console.error(error.message);
      } else {
        const school = rows;
        let slected_teacher_ids = JSON.parse(school[0].teacherId).teacherids;
        db.query(query, (error, rows) => {
          if (error) {
            req.flash("message", "Database connection lost Teachers Id");
            res.redirect("/");
            return console.error(error.message);
          } else {
            const group = rows;
            db.query(
              `SELECT * FROM teacher where teacher.isActive = "active"`,
              (error, rows) => {
                if (error) {
                  req.flash("message", "Database connection lost Teachers");
                  res.redirect("/");
                  return console.log(error);
                }
                const teachers = rows;
                res.render("admin/teacher-list-group", {
                  layout: "layoutadmin.hbs",
                  group,
                  teachers,
                  school,
                  message: req.flash("message"),
                  activeteachergroup: active,
                  imagePath: req.session.admin.imagePath,
                  username:
                    req.session.admin.firstname +
                    " " +
                    req.session.admin.lastname,
                  user: req.session.admin,
                  slected_teacher_ids,
                });
              }
            );
          }
        });
      }
    });
  } catch (error) {
    req.flash("message", "Database connection lost Teacher");
    res.redirect("/");
    console.log(error);
  }
});

router.post("/add-teacher-to-group", async (req, res) => {
  let teacher_ids = [];

  let data = {};
  if (
    req.body.teachername.length > 0 &&
    typeof req.body.teachername !== "string"
  ) {
    await req.body.teachername.map((teachername, i) => {
      teacher_ids.push(parseInt(teachername));
    });
    data = {
      teacherids: teacher_ids,
    };
  } else {
    data = {
      teacherids: [parseInt(req.body.teachername)],
    };
  }

  let totalteacher = data.teacherids.length;
  data0 = JSON.stringify(data);
  data1 = JSON.parse(data0);
  data2 = JSON.stringify(data1);
  db.query(
    "INSERT INTO teacherGroup (groupname,teacherId,totalteacher) values (?,?,?)",
    [req.body.groupname, data2, totalteacher],
    (error, rows) => {
      if (error) {
        return console.log(error);
      }
      db.query();
      res.redirect("/admin/teacher-group");
    }
  );
});

router.post("/view-teacher-group-members", async (req, res) => {
  let active;
  if (req.url === "/view-teacher-group-members") {
    active = "active";
  } else active = "";
  let groupname;
  let allTeachers;
  let groupID = req.body.groupID;
  let teacheringroup = [];
  let teacherlists;
  try {
    await db.query(
      "SELECT * FROM teacherGroup WHERE id=?",
      [req.body.groupID],
      async (error, rows) => {
        if (error) {
          req.flash("message", "Database connection lost teacherGroup");
          res.redirect("/");
          return console.log(error);
        }
        let group = rows;
        groupname = rows[0].groupname;

        let teacherids = JSON.parse(group[0].teacherId).teacherids;
        for (var i in teacherids) {
          await db.query(
            `SELECT t.*,s.schoolName FROM teacher AS t,school AS s WHERE t.schoolid = s.id AND t.id=? order by t.id desc`,
            [teacherids[i]],
            async (error, rows) => {
              if (error) {
                req.flash("message", "Database connection lost shoolName");
                res.redirect("/");
                return console.log(error);
              }
              allTeachers = rows[0];
              teacheringroup.push(allTeachers);
            }
          );
        }
        await db.query(
          `SELECT * FROM teacher where teacher.isActive = "active"`,
          (error, rows) => {
            if (error) {
              req.flash("message", "Database connection lost teacher");
              res.redirect("/");
              return console.log(error);
            }
            teacherlists = rows;
            res.render("admin/teacher-llist-in-a-group", {
              layout: "layoutadmin.hbs",
              activeteachergroup: active,
              groupname,
              teacheringroup,
              allTeachers,
              teacherlists,
              group,
              groupID,
              imagePath: req.session.admin.imagePath,
              username:
                req.session.admin.firstname + " " + req.session.admin.lastname,
              user: req.session.admin,
            });
          }
        );
      }
    );
  } catch (error) {
    req.flash("message", "Syntax Error");
    res.redirect("/");
    console.log(error);
  }
});

router.post("/edit-teacher-group", async (req, res) => {
  let currentgrpData;
  let updatinggrpData = [];
  try {
    db.query(
      "SELECT * FROM teacherGroup WHERE id=?",
      [req.body.groupID],
      async (error, rows) => {
        if (error) {
          req.flash("message", "Database connection lost teacherGroup");
          res.redirect("/");
          return console.log(error);
        }
        currentgrpData = JSON.parse(rows[0].teacherId).teacherids;
        let teacher_ids = [];
        let data = {};
        if (
          req.body.teachername.length > 0 &&
          typeof req.body.teachername !== "string"
        ) {
          await req.body.teachername.map((teachername, i) => {
            updatinggrpData.push(parseInt(teachername));
          });
        } else {
          updatinggrpData.push(parseInt(req.body.teachername));
        }

        currentgrpData.concat(updatinggrpData);
        let totalteacher = currentgrpData.concat(updatinggrpData).length;
        data = {
          teacherids: currentgrpData.concat(updatinggrpData).sort(),
        };
        data0 = JSON.stringify(data);
        data1 = JSON.parse(data0);
        data2 = JSON.stringify(data1);

        db.query(
          "UPDATE teacherGroup SET teacherId=?,totalteacher=? WHERE id=?",
          [data2, totalteacher, req.body.groupID],
          (error) => {
            if (error) {
              req.flash("message", "Database connection lost teacherGroup");
              res.redirect("/");
              return console.log(error);
            }
            res.redirect("/admin/teacher-group");
          }
        );
      }
    );
  } catch (error) {
    req.flash("message", "Syntax Error");
    res.redirect("/");
    console.log(error);
  }
});

router.post("/delete-teacher-from-group", async (req, res) => {
  let groupID = req.body.groupID;
  let idToDelete = req.body.id;
  try {
    db.query(
      "SELECT * FROM teacherGroup WHERE id =?",
      [groupID],
      (error, rows) => {
        if (error) {
          req.flash("message", "Database connection lost teacherGroup");
          res.redirect("/");
          return console.log(error);
        }
        currentgrpData = JSON.parse(rows[0].teacherId).teacherids;
        arr = currentgrpData.filter((item) => item !== parseInt(idToDelete));
        let totalteacher = arr.length;
        data = {
          teacherids: arr.sort(),
        };
        data0 = JSON.stringify(data);
        data1 = JSON.parse(data0);
        data2 = JSON.stringify(data1);
        db.query(
          "UPDATE teacherGroup SET teacherId=?,totalteacher=? WHERE id=?",
          [data2, totalteacher, groupID],
          (error) => {
            if (error) {
              req.flash("message", "Database connection lost teacherGroup");
              res.redirect("/");
              return console.log(error);
            }
            res.redirect("/admin/teacher-group");
          }
        );
      }
    );
  } catch (error) {
    req.flash("message", "Syntax Error");
    res.redirect("/");
    console.log(error);
  }
});

router.post("/edit-teacher", isLoggedIn, (req, res) => {
  try {
    let getdata =
      "UPDATE teacher SET firstname=?, lastname=?, email=?,schoolid=?,JudaicName =?,JudaicEmail =?,workbooks =?,books =? WHERE id=?";
    let dataid = [
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      req.body.schoolid,
      req.body.JudaicName,
      req.body.JudaicEmail,
      req.body.workbooks,
      req.body.books.toString(),
      req.body.id,
    ];
    if (req.body.oldemail == req.body.email) {
      db.query(getdata, dataid, (error, results, fields) => {
        if (error) {
          req.flash("message", "Database connection lost teacher");
          res.redirect("/");
          return console.error(error.message);
        }
        res.redirect("/admin/teacher-list");
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
            req.flash("message", "Email already exist");
            res.redirect("/admin/teacher-list");
          } else {
            db.query(getdata, dataid, (error, results, fields) => {
              if (error) {
                req.flash("message", "Database connection lost Syntax");
                res.redirect("/");
                return console.error(error.message);
              }
              res.redirect("/admin/teacher-list");
            });
          }
        }
      );
    }
  } catch (error) {
    req.flash("message", "Database connection lost teacherGroup");
    res.redirect("/");
    console.log(error);
  }
});

router.get("/view-pdf", function (req, res) {
  let active = "active";
  let pdfurl = req.session.tranfering_value;
  res.render("admin/view-pdf", {
    layout: "layoutteacher.hbs",
    pdfurl,
    activemystudents: active,
    imagePath: req.session.admin.imagePath,
    username: req.session.admin.firstname + " " + req.session.admin.lastname,
    user: req.session.admin,
  });
});

router.post("/view-pdf", isLoggedIn, (req, res) => {
  if (req.body.url) {
    req.session.tranfering_value = req.body.url;
    res.redirect("/admin/view-pdf");
  } else {
    req.flash("message", "No PDF");
    res.redirect("/admin/teacher-list");
  }
});

router.get(
  "/assigned-pdf-teacher-view/:teacherid",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let teacherid = req.params.teacherid;
    db.query(
      "SELECT t.*,p.*,ap.*,(SELECT COUNT(assignid) FROM assignPdf WHERE assignTo = t.id) AS TotalPdf FROM `assignPdf` AS ap ,`teacher` AS t , `pdf` AS  p WHERE t.id = ap.assignTo AND t.id =? AND p.pdfid = ap.pdfid ORDER BY ap.assignid desc",
      [teacherid],
      (error, rows) => {
        if (error) {
          return console.log(error);
        }
        res.render("admin/assigned-pdf-teacher-view", {
          layout: "layoutadmin",
          rows,
          imagePath: req.session.admin.imagePath,
          username:
            req.session.admin.firstname + " " + req.session.admin.lastname,
          user: req.session.admin,
        });
      }
    );
  })
);

router.post(
  "/assigned-pdf-teacher-view",
  isLoggedIn,
  catchAsync(async (req, res) => {
    res.redirect(`/admin/assigned-pdf-teacher-view/${req.body.id}`);
  })
);
router.post("/delete-teacher", isLoggedIn, (req, res) => {
  let deletedata = "DELETE FROM teacher WHERE id=?";
  let dataid = [req.body.id];

  db.query(deletedata, dataid, (error, rows, fields) => {
    if (error) {
      return console.error(error.message);
    }

    res.redirect("/admin/teacher-list");
  });
});

router.get(
  "/assigned-pdf-student-view/:studentid",
  catchAsync(async (req, res) => {
    let studentid = req.params.studentid;
    let tn = parseInt(studentid);
    db.query(
      "SELECT s.*,p.*,ap.*,t.firstname AS teacher_firstname,t.lastname AS teacher_lastname,(SELECT COUNT(assignid) FROM assignPdf WHERE assignToStudent = s.id) AS TotalPdf FROM `assignPdf` AS ap ,`student` AS s ,`teacher` AS t, `pdf` AS  p WHERE s.id = ap.assignToStudent AND s.id =? AND p.pdfid = ap.pdfid AND t.id = ap.assignFrom",
      [studentid],
      (error, rows) => {
        if (error) {
          return console.log(error);
        }
        res.render("admin/assigned-pdf-student-view", {
          layout: "layoutadmin",
          rows,
        });
      }
    );
  })
);

router.post(
  "/assigned-pdf-student-view",
  catchAsync(async (req, res, next) => {
    res.redirect(`/admin/assigned-pdf-student-view/${req.body.id}`);
  })
);

router.post("/edit-student", isLoggedIn, (req, res) => {
  let getdata =
    "UPDATE student SET firstname=?, lastname=?, email=?,password=?, mobile=?, schoolid=?, teacherid=?,classid=?,enrollmentnumber=? WHERE id=?";
  let dataid = [
    req.body.firstname,
    req.body.lastname,
    req.body.email,
    req.body.password,
    req.body.mobile,
    req.body.schoolid,
    req.body.teacherid,
    req.body.classid,
    req.body.enrollmentnumber,
    req.body.id,
  ];

  if (req.body.oldemail == req.body.email) {
    db.query(getdata, dataid, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }

      res.redirect("/admin/student-list");
    });
  } else {
    db.query(
      `SELECT t.*,s.* FROM teacher AS t,student AS s where s.email = "${req.body.email}" or t.email = "${req.body.email}"`,
      (err, rows, fields) => {
        if (err) {
          console.log(err);
        }
        let inactive = "inactive";
        if (rows && rows.length > 0) {
          req.flash("message", "Email already exist");
          res.redirect("/admin/student-list");
        } else {
          db.query(getdata, dataid, (error, results, fields) => {
            if (error) {
              return console.error(error.message);
            }

            res.redirect("/admin/student-list");
          });
        }
      }
    );
  }
});

router.post("/delete-student", isLoggedIn, (req, res) => {
  let deletedata = "DELETE FROM student WHERE id=?";
  let dataid = [req.body.id];

  db.query(deletedata, dataid, (error, rows, fields) => {
    if (error) {
      return console.error(error.message);
    }

    res.redirect("/admin/student-list");
  });
});

router.post("/delete-multiple-student", isLoggedIn, (req, res) => {
  let deletedata = "DELETE FROM student WHERE id=?";
  let dataid = [req.body.id];
  let deleteArrData = `DELETE FROM student
   WHERE id IN (${req.body.data});`;

  db.query(deleteArrData, (error, rows, fields) => {
    if (error) {
      console.error(error.message);
    }

    return res.status(200).json({
      status: "success",
    });
  });
});
router.post("/change-student-status", isLoggedIn, function (req, res) {
  if (req.body.status === "active") {
    let changestatus = "UPDATE student set isActive=? WHERE id=?";
    let dataid = ["inactive", req.body.id];

    db.query(changestatus, dataid, (error, rows, fields) => {
      if (error) {
        return console.error(error.message);
      }

      res.redirect("/admin/student-list");
    });
  } else {
    console.log("false");
    let changestatus = "UPDATE student set isActive=? WHERE id=?";
    let dataid = ["active", req.body.id];

    db.query(changestatus, dataid, (error, rows, fields) => {
      if (error) {
        return console.error(error.message);
      }
      db.query(
        "SELECT * FROM student WHERE id=?",
        [req.body.id],
        async (error, rows) => {
          if (rows) {
            const message = `<p>Your Account is Activated! Login to access your account</p>`;

            try {
              await sendEmail({
                email: rows[0].email,
                subject: `Your Account is Activated! Login to access your account`,
                message,
              });
              res.redirect("/admin/student-list"); //flash msg remaining
            } catch (err) {
              console.log(err);
            }
          }
        }
      );
    });
  }
});

router.post("/change-teacher-status", isLoggedIn, (req, res) => {
  if (req.body.status === "active") {
    let changestatus = "UPDATE teacher set isActive=? WHERE id=?";
    let dataid = ["inactive", req.body.id];

    db.query(changestatus, dataid, (error, rows, fields) => {
      if (error) {
        return console.error(error.message);
      }

      res.redirect("/admin/teacher-list");
    });
  } else {
    let changestatus = "UPDATE teacher set isActive=? WHERE id=?";
    let dataid = ["active", req.body.id];
    db.query(changestatus, dataid, (error, rows, fields) => {
      if (error) {
        return console.error(error.message);
      }
      db.query(
        "SELECT * FROM teacher WHERE id=?",
        [req.body.id],
        async (error, rows) => {
          if (rows) {
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
       
                <td style="padding: 36px 41px 36px 41px; line-height: 24px;">
                Your account for the L'havin Connect platform has been verified and activated. Your workbooks will be assigned shortly and you will be notified via email.  Thank you for using the platform, and we wish you much Hatzlacha on your journey with your students.
                </td>
            </tr>
            <tr>
                <td style="padding: 10px 41px;position: relative;bottom: 25px;">Thank you,<br>COJDS</td>
            </tr>
             
        </table>
                  <table style="background-color: #6b0e3d; color: white; font-size:18px;border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;">
         
        </table>
    </div>
</body>
</html>`;

            try {
              await sendEmail({
                email: rows[0].email,
                subject: `Your Account is Activated! Login to access your account`,
                message,
              });
              res.redirect("/admin/teacher-list"); //flash msg remaining
            } catch (err) {
              console.log(err);
            }
          }
        }
      );
    });
  }
});

router.get("/manage-schools", isLoggedIn, function (req, res) {
  let active;
  if (req.url === "/manage-schools") {
    active = "active";
  } else active = "";
  let query = `SELECT * FROM school`;
  db.query(query, (error, rows) => {
    if (error) {
      return console.error(error.message);
    } else {
      res.render("admin/manage-schools", {
        layout: "layoutadmin.hbs",
        activemanageschools: active,
        rows: rows,
        imagePath: req.session.admin.imagePath,
        username:
          req.session.admin.firstname + " " + req.session.admin.lastname,
        user: req.session.admin,
        message: req.flash("message"),
        emessage: req.flash("emessage"),
      });
    }
  });
});

router.post("/add-school", isLoggedIn, (req, res) => {
  // console.log(req.body);
  // console.log(req.query);
  // console.log("in edit school");
  //INSERT INTO `school`(`id`, `schoolName`, `createdAt`, `isActive`) VALUES ([value-1],[value-2],[value-3],[value-4])
  let updatedata = "INSERT INTO school (schoolName) VALUES (?)";
  let data = [req.body.schoolname];

  db.query(updatedata, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    // console.log("Rows affected:", results.affectedRows);
    //return alert("This is alert box!");
    res.redirect("/admin/manage-schools");
  });
  //res.render("partials/add-schools", { layout: "layoutadmin.hbs" });
});

router.post("/edit-school", isLoggedIn, (req, res) => {
  // console.log("inside edit-school", req.body);
  let getdata = "UPDATE school SET schoolName=? WHERE id=?";
  let dataid = [req.body.schoolname, req.body.id];
  //let data = ["student"];

  db.query(getdata, dataid, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    // console.log("Rows updated:", results);
    //return alert("This is alert box!");
    res.redirect("/admin/manage-schools");
  });
});

router.post("/delete-school", isLoggedIn, (req, res) => {
  // console.log(req.body);
  // console.log("inside");
  let deletedata = "DELETE  FROM school where id=?";
  let dataid = [req.body.id];
  //let data = ["student"];

  db.query(deletedata, dataid, (error, rows, fields) => {
    if (error) {
      return console.error(error.message);
    }
    //console.log("Rows affected:", rows);
    //return alert("This is alert box!");
    res.redirect("/admin/manage-schools");
  });
});

router.post("/change-school-status", isLoggedIn, (req, res) => {
  // console.log(req.body);
  if (req.body.status === "active") {
    console.log("true");

    let changestatus = "UPDATE school set isActive=? WHERE id=?";
    let dataid = ["inactive", req.body.id];
    //let data = ["student"];

    db.query(changestatus, dataid, (error, rows, fields) => {
      if (error) {
        return console.error(error.message);
      }
      // console.log("Rows affected:", rows);
      //return alert("This is alert box!");
      res.redirect("/admin/manage-schools");
    });
  } else {
    console.log("false");
    let changestatus = "UPDATE school set isActive=? WHERE id=?";
    let dataid = ["active", req.body.id];
    //let data = ["student"];

    db.query(changestatus, dataid, (error, rows, fields) => {
      if (error) {
        return console.error(error.message);
      }
      // console.log("Rows affected:", rows);
      //return alert("This is alert box!");
      res.redirect("/admin/manage-schools");
    });
  }
});

router.get("/manage-class", isLoggedIn, function (req, res) {
  let active;
  if (req.url === "/manage-class") {
    active = "active";
  } else active = "";
  let query = `SELECT c.*,(SELECT school.schoolName FROM school WHERE school.id = c.schoolid) AS school_name FROM class AS c`;

  db.query("SELECT * FROM school", (error, rows) => {
    if (error) {
      return console.error(error.message);
    } else {
      let school_data = rows;

      db.query(query, (error, rows) => {
        if (error) {
          return console.error(error.message);
        } else {
          res.render("admin/manage-class", {
            layout: "layoutadmin.hbs",
            activemanageclass: active,
            rows: rows,
            imagePath: req.session.admin.imagePath,
            username:
              req.session.admin.firstname + " " + req.session.admin.lastname,
            user: req.session.admin,
            school_data,
          });
        }
      });
    }
  });
});
router.post("/add-class", isLoggedIn, (req, res) => {
  let updatedata = "INSERT INTO class (schoolid, className) VALUES (?, ?)";
  let data = [req.body.schoolid, req.body.classname];

  db.query(updatedata, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    res.redirect("/admin/manage-class");
  });
});

router.post("/edit-class", isLoggedIn, (req, res) => {
  let getdata = "UPDATE class SET schoolid=?, className=? WHERE id=?";
  let dataid = [req.body.schoolid, req.body.classname, req.body.id];

  db.query(getdata, dataid, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    res.redirect("/admin/manage-class");
  });
});

router.post("/delete-class", isLoggedIn, (req, res) => {
  let deletedata = "DELETE FROM class WHERE id=?";
  let dataid = [req.body.id];

  db.query(deletedata, dataid, (error, rows, fields) => {
    if (error) {
      return console.error(error.message);
    }

    res.redirect("/admin/manage-class");
  });
});
router.post("/change-class-status", isLoggedIn, (req, res) => {
  if (req.body.status === "active") {
    console.log("true");

    let changestatus = "UPDATE class set isActive=? WHERE id=?";
    let dataid = ["inactive", req.body.id];

    db.query(changestatus, dataid, (error, rows, fields) => {
      if (error) {
        return console.error(error.message);
      }

      res.redirect("/admin/manage-class");
    });
  } else {
    console.log("false");
    let changestatus = "UPDATE class set isActive=? WHERE id=?";
    let dataid = ["active", req.body.id];

    db.query(changestatus, dataid, (error, rows, fields) => {
      if (error) {
        return console.error(error.message);
      }

      res.redirect("/admin/manage-class");
    });
  }
});

router.get(
  "/admin-edit-profile",
  isLoggedIn,
  catchAsync(async function (req, res, next) {
    let active = "active";
    await db.query(
      "select * from admin WHERE id=?",
      [req.session.admin.id],
      catchAsync(async function (err, rows, next) {
        res.render("admin/admin-edit-profile", {
          layout: "layoutadmin.hbs",
          admineditprofileactive: active,
          message: req.flash("message"),
          failed: req.flash("failed"),
          rows,
          imagePath: req.session.admin.imagePath,
          username:
            req.session.admin.firstname + " " + req.session.admin.lastname,
          user: req.session.admin,
        });
      })
    );
  })
);
router.post("/admin-edit-profile", isLoggedIn, function (req, res) {
  let lastname = req.body.lastname;
  let updatedata =
    "UPDATE admin SET firstname =?, lastname= ?, email =?, mobile=? WHERE id = ?";
  let data = [
    req.body.firstname,
    req.body.lastname,
    req.body.email,
    req.body.mobile,
    req.session.admin.id,
  ];

  if (!req.body.email) {
    req.flash("failed", "Email can not be empty");
    res.redirect("/admin/admin-edit-profile");
  } else if (!req.body.mobile) {
    req.flash("failed", "Enter your mobile no.");
    res.redirect("/admin/admin-edit-profile");
  } else if (
    parseInt(req.body.mobile) &&
    parseInt(req.body.mobile).toString().length > 14
  ) {
    req.flash("failed", "Mobile no. can not be greater than 13 number");
    res.redirect("/admin/admin-edit-profile");
  } else if (
    parseInt(req.body.mobile) &&
    parseInt(req.body.mobile).toString().length < 6
  ) {
    req.flash("failed", "Mobile no. can not be less than 6 number");
    res.redirect("/admin/admin-edit-profile");
  } else {
    db.query(updatedata, data, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }

      db.query(
        "SELECT * FROM admin WHERE id =?",
        [req.session.admin.id],
        (err, rows, fields) => {
          if (err) {
            console.log(err);
          }
          if (rows && rows.length > 0) {
            req.session.admin = rows[0];
          }
          req.flash("message", "Profile Updated Successfully");
          res.redirect("/admin/admin-edit-profile");
        }
      );
    });
  }
});

router.get("/change-password", isLoggedIn, (req, res) => {
  let active;
  if (req.url === "/change-password") {
    active = "active";
  } else active = "";
  let messages = req.flash("info");
  res.render("admin/change-password", {
    layout: "layoutadmin.hbs",
    activechangepassword: active,
    message: req.flash("message"),
    errormessage: req.flash("errormessage"),
    hasMessage: messages,
    messages: messages,
    iimagePath: req.session.admin.imagePath,
    username: req.session.admin.firstname + " " + req.session.admin.lastname,
    user: req.session.admin,
  });
});
router.post(
  "/change-password",
  isLoggedIn,

  catchAsync(async function (req, res, next) {
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;
    let confirmpassword = req.body.confirmpassword;
    let finduser = "SELECT * FROM admin WHERE id =?";
    let data = req.session.admin.id;
    await db.query(finduser, data, async (error, rows, fields) => {
      if (error) {
        return console.error(error.message);
      }
      if (oldpassword != rows[0].password) {
        var messages = req.flash("error");
        req.flash("errormessage", "Old Password is incorrect");
        res.redirect("/admin/change-password");
      } else {
        let updateuser = "UPDATE admin SET password =? WHERE id =?";
        let updatedata = [newpassword, req.session.admin.id];
        await db.query(updateuser, updatedata, (error, results, fields) => {
          if (error) {
            return console.error(error.message);
          }
          req.flash("message", "Password Updated");
          res.redirect("/admin/change-password");
        });
      }
    });
  })
);

router.get("/email-settings", isLoggedIn, (req, res) => {
  let active;
  if (req.url === "/email-settings") {
    active = "active";
  } else active = "";
  let getdata = "SELECT * FROM email";

  db.query(getdata, (error, rows, fields) => {
    if (error) {
      return console.error(error.message);
    }

    res.render("admin/email-settings", {
      layout: "layoutadmin.hbs",
      message: req.flash("message"),
      activeemailsettings: active,
      host: rows[0].host,
      email: rows[0].email,
      password: rows[0].password,
      imagePath: req.session.admin.imagePath,
    });
  });
});
router.post("/email-settings", isLoggedIn, function (req, res) {
  let updatedata =
    "UPDATE email SET host=?, email=?, password =? WHERE id =? AND role=?";
  let data = [req.body.host, req.body.email, req.body.password, 1, "admin"];

  db.query(updatedata, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    req.flash("message", "Email Settings Updated Successfully");
    res.redirect("/admin/email-settings");
  });
});

router.get("/kami-settings", (req, res) => {
  db.query(
    `SELECT * from kamiKeyManagement WHERE id =?`,
    [1],
    (error, rows) => {
      let kamikey = rows[0];
      res.render("admin/kami-settings", {
        layout: "layoutadmin.hbs",
        message: req.flash("message"),
        kamikey: kamikey,
        key: rows[0].kamiKey,
      });
    }
  );
});

router.post(
  "/edit-kami-settings",
  catchAsync(async (req, res) => {
    db.query(
      "UPDATE kamiKeyManagement set kamiKey=? WHERE id=?",
      [req.body.kamikey, 1],
      (error, rows) => {
        if (error) {
          console.log(error);
        }
        req.flash("message", "Kami Key Updated Successfully!");
        res.redirect("/admin/kami-settings");
      }
    );
  })
);

router.get("/logout", function (req, res) {
  console.log("IN LOGOUT");
  if (req.session.admin) {
    let a = standardDate.date();
    let updateuser = "UPDATE admin SET lastlogintime =? WHERE id =?";
    let updatedata = [a, req.session.admin.id];
    db.query(updateuser, updatedata, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      // console.log("Rows affected:", results.affectedRows);
      //      next();
    });
    req.session.admin = undefined;
    req.logout();
    res.redirect("/admin/login");
  } else {
    res.redirect("/admin/login");
  }
});

router.post("/re-assign/:assignId", (req, res) => {
  const assignId = Number(req.params.assignId);
  db.query(
    "SELECT ap.*, t.*, p.* FROM assignPdf AS ap, teacher AS t, pdf AS p WHERE assignid = ? AND assignTo = id AND p.pdfid=ap.pdfid",
    [assignId],
    (error, rows) => {
      const currentRow = rows[0];
      if (!currentRow) {
        res.redirect(`/admin/editting-history-teacher/${currentRow.assignTo}`);
        return;
      }
      const pdfid = currentRow.pdfid;
      const teacherId = currentRow.id;
      const teacherDescription = currentRow.teacherDescription;
      let lastedit = currentRow.date;
      db.query("DELETE FROM assignpdf WHERE assignid=?", [assignId]);
      db.query("DELETE FROM pdfedithistorybymember WHERE assignPdf_id=?", [
        assignId,
      ]);
      db.query(
        `INSERT INTO assignpdf (assignBy, assignTo , teacherDescription, pdfid,date, isReassigned) values (?,?,?,?,?,?)`,
        ["admin", teacherId, teacherDescription, pdfid, lastedit, 1],

        (error, rows) => {
          if (error) {
            console.log(error);
          }
        }
      );

      req.flash("message", "Reassigned-successfully");
      res.redirect(`/admin/editting-history-teacher/${currentRow.assignTo}`);
    }
  );
});
module.exports = router;
