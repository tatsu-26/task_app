var express = require("express");
var router = express.Router();
var con = require("./mysqlConnection");

exports.mypage = function(req, res) { 
  var userId = req.session.user
  // if (userId) {
  //   var query = 'SELECT user.id, user.name FROM users WHERE user.id = ' + userId;
  //   connection.query(query, function(err, rows) {
  //     if (!err) {
  //       res.locals.user = rows.length? rows[0]: false;
  //     }
  //   });
  // }
  res.render("users/mypage", req.session.user_id)
}
exports.index = function(req, res) { 
  res.render("users/index");
};
exports.new = function(req, res)  {
  res.render("users/new");
}
exports.create = function(req, res){
  console.log(req.cookies._csrf)
  var name = req.body.name;
  var email = req.body.email;
  var encryped_password = req.body.password;
  var query = 'INSERT INTO users (name, email, encryped_password) VALUES ("' + name + '", "' + email + '", "' + encryped_password + '")';
  con.query(query, function(err, rows) { 
    res.redirect("/users/login");
  });
};
exports.login = function(req, res, next)  {
  if (req.session.user_id) { 
    res.redirect("/");
  } else {
    res.render("users/login", { 
      title: "ログイン"
    });
  }
}
exports.session = function(req, res, next) { 
  var email = req.body.email;
  var encryped_password = req.body.password;
  var query = 'SELECT id FROM users WHERE email = "' + email + '" AND encryped_password = "' + encryped_password + '" LIMIT 1';
  con.query(query, function(err, rows) {
    var userId = rows[0].id
    res.redirect("/users/mypage");
  });
};

exports.logout = function(req, res, next) { 
  req.session.destroy();
  res.redirect("users/login");
}
  //     req.session.user_id = userId;
  //     res.redirect('/users/mypage');
  // });
  // req.session.save(function(err) {
  //   // session saved
  // })
