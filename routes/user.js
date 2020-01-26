var express = require("express");
var router = express.Router();
var con = require("./mysqlConnection");
var bcrypt = require('bcrypt'); 
exports.index = function(req, res) { 
  res.render("users/index");
};
exports.new = function(req, res)  {
  res.render("users/new");
}
exports.create = function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var saltRounds = 10;
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(req.body.password, salt);
  var encryped_password = hash
  var query = 'INSERT INTO users (name, email, encryped_password) VALUES ("' + name + '", "' + email + '", "' + encryped_password + '")';
  con.query(query, function(err, rows) { 
    res.redirect("/users/login");
  });
};
exports.login = function(req, res, next)  {
  res.render("users/login");
}
exports.session = function(req, res, next) { 
  var email = req.body.email;
  var password = req.body.password;
  var secret = req.cookies._csrf
  var saltRounds = 10;
  // ソルトを生成
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(password, salt);
  var query = 'SELECT encryped_password FROM users WHERE email = "' + email + '" LIMIT 1';
  con.query(query, function(err, rows) {
    bcrypt.compare(password, rows[0].encryped_password).then(function(res) { 
      if(res == true){
        var query = 'SELECT id FROM users WHERE email = "' + email + '" LIMIT 1';
        con.query(query, function(err, rows)  {
          if(rows[0]) {
            req.session.user_id = rows[0].id
            res.redirect("/users/mypage");
          } else { 
            res.redirect("/users/login");
          }
        })
      }
    })
    
    
    
  });
};
exports.logout = function(req, res, next) { 
  req.session.destroy();
  res.redirect("users/login");
}
exports.mypage = function(req, res) { 
  if (req.session.user_id) {
    var userId = req.session.user_id
    var query = 'SELECT id, name FROM users WHERE id = ' + userId;
    con.query(query, function(err, rows) {
      if (!err) {
        var name = rows[0].name
        console.log(name)
      }
      res.render("users/mypage", {name: name})
    });
  } else {
    res.redirect("/users/login")
  };
}