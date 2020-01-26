var express = require("express"); //node用のwebフレームワーク
var logger = require("morgan"); //ログ出力
var session = require("express-session"); //セッション管理
var methodOverride = require("method-override"); //putやdeleteメソッドに対応
var app = express();
  user = require("./routes/user");
var bodyParser = require("body-parser"); //POSTメソッドをJSON形式で送信してくれる
var MySQLStore = require("express-mysql-session")(session); //セッションデータを保存するデータベーステーブルを作成
var csrf = require("csurf"); //csrf対策
var csrfProtection = csrf({ cookie: true });
var cookieParser = require("cookie-parser");
// var parseForm = bodyParser.urlencoded({ extended: false });
var bcrypt = require('bcrypt'); 
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

const { Sequelize } = require("sequelize");
const db = require("./models/index");
const host     = 'localhost';
const database = 'express_db';
const username = 'root';
const password = '';

// sequelize接続
const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'mysql',
});
sequelize.authenticate()
  .then(()       => { console.log('Success test connection');        })
  .catch((error) => { console.log('Failure test connection', error); });
  
  const UserModel = sequelize.define("user", {
    id: {field: "id", type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true}
  })
  // UserModel.findAll({
  //   where: {
  //     id: 3
  //   }
  // }).then((result) =>{
  //   console.log(reault)
  // })

app.set("views", __dirname + "/views");
app.set("view engine", "ejs"); //テンプレートエンジンを指定
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
app.get("/users/new", csrfProtection, function(req, res) { 
  console.log(req.session._csrf)
  var secret = req.cookies._csrf
  var saltRounds = 10;
  // ソルトを生成
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(secret, salt);
  req.session._csrf = hash
  res.render("users/new")
});
app.post("/users/create", function (req, res, next) {
  if(req.session._csrf) { 
    bcrypt.compare(req.cookies._csrf, req.session._csrf).then(function(res) { 
      next();
    })
  }else{
    res.redirect("/users/new");
  }
})
//routiong
app.get("/", user.index);
app.get("/logout", user.logout);
app.get("/users/new", user.new);
app.post("/users/create", user.create);
app.get("/users/login", user.login);
app.post("/users/login", user.session);
app.get("/users/mypage", user.mypage);
app.listen(3000);

