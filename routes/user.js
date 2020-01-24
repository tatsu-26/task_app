var express = require("express");
var router = express.Router();
var con = require("./mysqlConnection");
var name = ""
exports.mypage = function(req, res) { 
  var userId = req.session.user_id
  if (userId) {
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
exports.index = function(req, res) { 
  res.render("users/index");
};
exports.new = function(req, res)  {
  res.render("users/new");
}
exports.create = function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var encryped_password = req.body.password;
  var query = 'INSERT INTO users (name, email, encryped_password) VALUES ("' + name + '", "' + email + '", "' + encryped_password + '")';
  con.query(query, function(err, rows) { 
    res.redirect("users/login");
  });
};
exports.login = function(req, res, next)  {
  res.render("users/login");
}
exports.session = function(req, res, next) { 
  var email = req.body.email;
  var encryped_password = req.body.password;
  var query = 'SELECT id FROM users WHERE email = "' + email + '" AND encryped_password = "' + encryped_password + '" LIMIT 1';
  con.query(query, function(err, rows) {
    if(rows) {
      req.session.user_id = rows[0].id
      res.redirect("/users/mypage");
    } else { 
      res.redirect("/users/login");
    }
    
  });
};
exports.logout = function(req, res, next) { 
  req.session.destroy();
  res.redirect("users/login");
}
 