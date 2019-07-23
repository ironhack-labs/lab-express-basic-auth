// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// GET home page 
router.get('/', (req, res, next) => {
  res.render('index');
});

// GET signip
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// GET login
router.get('/login', function(req, res, next) {
  res.render('login');
});

//GET profile
router.get('/profile', (req, res, next) => {
  res.render('profile');
});

// get puppy picture
router.get('/main', (req, res, next) => {
  res.render('main');
});

// get private gif

router.get('/private', (req, res, next) => {
  res.render('private');
});


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
      res.render("auth/signup", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }

  User.findOne({ "username": username })
    .then(user => {
      if (user !== null) {
          res.render("auth/signup", {
            errorMessage: "The username already exists!"
          });
          return;
        }
        else{
          User.create({
            username,
            password: hashPass
          })
          .then(() => {
            res.redirect("/login");
          })
          .catch(error => {
            console.log(error);
          })
        }
 
    })
    .catch(error => {
      next(error);
    })
});


router.post('/login', function(req, res, next) {
  User.findOne({username: req.body.username})
    .then((user)=> {
      if(user) {
        bcrypt.compare(req.body.password, user.password, function(err, match){
          if(err) throw new Error 
          if(match) {
            req.session.user = user;
            res.redirect('/profile')
          } else {
            res.send("invalid credentials.")
          }
        });
      } else {
        res.send("invalid credentials.");
      }
    });
});

router.get("/logout", (req,res)=> {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
})


// Protect

router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next(); 
  } else {                         
    res.redirect("/login");         
  }                                 
}); 
router.get("/profile", (req, res, next) => {
  res.render("profile");
});



module.exports = router;