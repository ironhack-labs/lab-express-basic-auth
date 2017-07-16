var express = require('express');
var router = express.Router();

// ***********************************************ToDo: EJEMPLO DE LOS APUNTES, NO FUNCIONA, QUEDA EN BUCLE
/* router.use((req, res, next) => {
    console.log("aaaa:",req.session.currentUser);
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

router.get("/private", (req, res, next) => {
  res.render("private");
}); */

function auth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}
// User model
const User = require("../models/user");

router.get('/index', function (req, res, next) { 
     let user = req.session; //currentUser
     console.log(user,"");

    res.render('index',user); 
    //res.render('index');
});


 router.get("/private", (req, res, next) => {


  res.render("private");
}); 



module.exports = router;