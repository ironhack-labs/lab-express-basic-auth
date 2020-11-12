const { Router } = require('express');
const router = new Router();

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');
 
// .get() route ==> to display the signup form to users
router.get('/signup', (req,res) =>  res.render("./auth/signup"))
 
// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
    const {Username, Password,email} = req.body
      if (!Username || !Password ){
      res.render("./auth/signup", {
          Username,
          Password,
          email,
          errorMessage: "All fields are mandatory. Please provide your username, email and password.",
      })
      return;
      }    
      
      const strongPasswordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}/;

  // Validate that incoming password matches regex pattern.
  if (!strongPasswordRegex.test(Password)) {
    res.status(500).render("auth/signup", {
      //email,
      Username,
      errorMessage:
        "Password needs to have at least 5 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }


bcryptjs
    .genSalt(saltRounds)
    .then(salt => 
      bcryptjs.hash(Password,salt))
    .then((hashedPassword) =>
      User.create({ Username, email, Password: hashedPassword })
        .then((newUser) => {
          console.log(newUser);
          res.redirect("/user-profile");
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render("auth/signup", {
              email,
              Username,
              validationError: error.message,
            });
          } else if (error.code === 11000) {
            res.status(500).render("auth/signup", {
              email,
              Username,
              errorMessage:
                "Username and email need to be unique. Either username or email is already used.",
            });
          } else {
            next(error);
          }
        })
    )
    .catch((err) => next(err));
  });   
    
  router.get('/user-profile', (req, res) => res.render('users/user-profile', {user : req.session.user}));

  router.get('/login', (req, res) => res.render('auth/login'));

  router.post("/login", (req, res, next) => {
       const { Username, Password } = req.body;
      if (!Username || !Password) {
      res.render("auth/login", {
        Username,
        errorMessage:
          "All fields are mandatory. Please provide your email and password.",
      });
      return;
    }
  
    // find user and send correct response
    User.findOne({ Username })
          .then((user) => {
        if (!user) {
          res.render("auth/login", {
            Username,
            errorMessage: "Email is not registered. Try with other email.",
          });
          return;
        } else if (bcryptjs.compareSync(Password, user.Password)) {
          req.session.user = user;
          //console.log(user);
          res.redirect("/user-profile");
         // res.render("users/user-profile", {user})
        } else {
          res.render("auth/login", {
            Username,
            errorMessage: "Incorrect password",
          });
        }
      })
      .catch((error) => next(error));
  });

  router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
  });
  
   router.get("/main", checkForStatus, (req,res)  =>{
    res.render("auth/main")
  }) 

  router.get("/private", checkForStatus, (req,res) =>{
    res.render("auth/private")
  }) 

  function checkForStatus(req,res,next) {
    if(req.session.user){
    next();
    }
    else{
      res.redirect("/login")
    }

  }




module.exports = router;