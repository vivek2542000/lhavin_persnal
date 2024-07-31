const mysql = require("mysql");
const dotenv = require("dotenv");
const app = require("./app");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
