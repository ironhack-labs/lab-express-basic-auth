var express = require('express');
var router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post("/", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("index", {
       errorMessage: "You should type your username and password"
     });
     return;
    }
    User.findOne({"username": username}, (error, user) => {
      if(error || !user) {
        res.render('index', {
          errorMessage: "You can't pass due to some issues with your account"
        });
        return;
      }


      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      } else{
        res.render('index', {
          errorMessage:" You shouldn't be here"
        });
      }
    });
});
module.exports = router;
