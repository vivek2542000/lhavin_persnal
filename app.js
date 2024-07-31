const createError = require("http-errors");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const fileUpload = require("express-fileupload");

const AppError = require("./public/utils/appError");

const globalErrorHandler = require("./public/controllers/errorController");

//const request = require("request");
const routes = require("./routes/index");
const userRoutes = require("./routes/user");
const teacherRoutes = require("./routes/teacher");
const adminRoutes = require("./routes/admin");
dotenv.config({ path: "./config.env" });
const passport = require("passport");
const flash = require("connect-flash");
const expressHbs = require("express-handlebars");

const mysql = require("mysql");
const expressValidator = require("express-validator");
const bodyParser = require("body-parser");

const app = express();
app.use(fileUpload());

const db = mysql.createPool({
  // host: "203.190.153.20","18.219.193.164"
  host: "127.0.0.1",
  path: "/phpmyadmin",
  user: "root",
  // password: "Digimonk@123",
  // database: "jeweshnew",
  database: "jewesh",
  multipleStatements: true,
});
global.db = db;

const Handlebars = require("handlebars");
Handlebars.registerHelper("equal", function (lvalue, rvalue, options) {
  if (arguments.length < 3)
    throw new Error("Handlebars Helper equal needs 2 parameters");
  if (lvalue != rvalue) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
app.engine(
  ".hbs",
  expressHbs({
    defaultLayout: "layout",
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
      if_equal: function (a, b, opts) {
        if (a == b) {
          return opts.fn(this);
        } else {
          return opts.inverse(this);
        }
      },
      // viewersCount: function (viewer) {
      //   return viewer.length || 0;
      // },
    },
  })
);

app.set("view engine", ".hbs");

//app.use(bodyParser.json({ limit: "50mb" }));
app.use(expressValidator());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  session({
    secret: "my-super-secret",

    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);
app.use(flash());
require("./public/controllers/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use("/pictures", express.static(path.join(__dirname, "pictures")));

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use("/admin", adminRoutes);
app.use("/teacher", teacherRoutes);
app.use("/user", userRoutes);
app.use("/", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log("ERROR: ", err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  let module = req.user ? req.user.role : "";
  let render_to = "";

  if (module == "admin") {
    render_to = "/admin/admin-dashboard";
  } else if (module == "teacher") {
    render_to = "/teacher/teacher-dashboard";
  } else if (module == "student") {
    render_to = "/user/student-dashboard";
  } else {
    render_to = "/";
  }
  // console.log("render_to", req.user, render_to);

  res.render("error", { layout: "", render_to });
});

app.all("*", (req, res) => {
  res.redirect("/");
});

app.use(globalErrorHandler);

module.exports = app;
