const express = require("express");
const router = express.Router();
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const User = require('../models/user');

router.get('/', (req, res, next) =>{
  res.render('index', {title: "Express"});
});




// --------------------------------------------------LOGIN-----------------------------------------------------

//GET THE LOGIN PAGE
router.get('/login', (req, res) => {
  res.render('auth/login');
});

//VERIFY THE LOGIN INFORMATION
router.post("/login", (req, res) => {
  let userName = req.body.userName;
  let password = req.body.password;

  if (userName === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Username and password required!"
    });
    return;
  }


User.findOne({userName: userName}, (err, user) => {
  if(err) {
    next(err);
  } else {
    if (!user) {
      res.render("auth/login", {
        errorMessage: "Username doesn't exist - sign up!"
      });
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.render("user");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password..."
        });
      }
    }
  }
});

});


router.get('/logout', (req, res)=>{
  req.session.destroy(function(err) {
    res.redirect("/");
  });
});





router.get('/signup', function(req, res) {
  res.render('auth/signup');
});


router.post('/signup', (req, res, next) => {
  var userName = req.body.userName;
  var password = req.body.password;

  if (userName === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up..."
    });
    return;
  }else{
    User.findOne({ userName: userName}, (err, user) => {
      if(err){
        next(err);
      } else {
        if(!user) {
          // no user
          var salt     = bcrypt.genSaltSync(bcryptSalt);
          var hashPass = bcrypt.hashSync(password, salt);

          var newUser  = User({
            userName,
            password: hashPass
          });
          console.log(newUser);
          newUser.save((err) => {
            if (err) {
              next(err);
            } else {
              res.redirect("/");
            }
          });
        }else {
            res.render("auth/signup", {
            errorMessage: "Username taken!"
          });
        }
      }
    });
  }
});






module.exports = router;
