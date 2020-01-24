var express = require("express");
var router = express.Router();



// function sessionCheck(req, res, next) { 
//   if (req.session.user) { 
//     console.log(req.session.user)
//     res.render("index", { name: req.session.user.id});
//   } else {
//     res.redirect("/login");
//   }
// }

module.exports = router;