var mysql = require("mysql");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

var options = {
  host: "localhost",
  user: "root",
  database: "express_db"
}

var con = mysql.createPool(options);

module.exports = con;