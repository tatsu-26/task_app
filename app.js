var express = require("express");
var logger = require("morgan");
var session = require("express-session");
var methodOverride = require("method-override");
var app = express();
  user = require("./routes/user");
var bodyParser = require("body-parser");
var MySQLStore = require("express-mysql-session")(session);
var csrf = require("csurf");
var csrfProtection = csrf({ cookie: true});
var cookieParser = require("cookie-parser");
var parseForm = bodyParser.urlencoded({ extended: false });
var tokens = new csrf();
var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  database: "express_db",
  schema: {
    tableName: "custom_sessions_table_name",
    columnNames: {
      session_id: "custom_session_id",
      expires: "cumstom_expires_column_name",
      data: "custom_data_column_name"
    }
  }
};
var sessionStore = new MySQLStore(options);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
if (app.get("env") === "production"){
  app.set("trust proxy", 1);
  session.cookie.secure = true
}

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session( {
  key: "session_cookie_name",
  secret: "session_cookie_secret",
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));
app.use(cookieParser());
app.use(methodOverride());
app.use(logger("dev"));

//csrf対策
app.get("/users/new", csrfProtection, function(req, res, next) { 
  res.render("users/new", )
});
app.post("/", function (req, res) { 
  var token = req.cookies._csrf;
  if(csrfToken != token){
    res.send('Invalid Token')
  };
  next();
})
//outiong
app.get("/", user.index);
app.get("/users/logout", user.logout);
app.get("/users/mypage", user.mypage);
app.get("/users/new", user.new);
app.post("/users/create", user.create);
app.get("/users/login", user.login);
app.post("/users/login", user.session);
app.listen(3000);

