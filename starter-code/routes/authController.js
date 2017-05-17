const express        = require("express");
const User           = require('../models/user');
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

const authController = express.Router();


authController.get("/", (req, res, next) => {
  res.render("index");
});

authController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authController.post("/signup", (req, res, next)=> {
  let username = req.body.username;
  let password = req.body.password;
  var salt     = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  let userInfo = User({
    username,
    password : hashPass
    });

  User.findOne({'username': userInfo.username}, (err, user)=> {
    if (err) {
      next (err);
    } else {
      if (user) {
        res.render('auth/signup', {errorMessage:'Username already taken'});
      } else {
        if (username === "" | password === ""){
          res.render('auth/signup',{errorMessage: "Indicate a username and a password to sign up"});
        }
          else {
            userInfo.save((err)=>{
          if (err) {
            res.render('auth/signup', {errorMessage:'error in saving user'});
          } else {
            res.redirect('/')
            }
          });
        }
      }
    }
  });
});

authController.get('/login', (req, res, err)=> {
  res.render('auth/login');
});

authController.post('/login', (req, res, err)=> {
  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
   res.render("auth/login", {errorMessage: "Indicate a username and a password to sign up"});
   return;
 }

 User.findOne({"username": username},"_id username password following",(err, user) => {
       if (err || !user) {
         res.render("auth/login", {errorMessage: "The username doesn't exist"});
         return;
       } else {
         if (bcrypt.compareSync(password, user.password)) {
           req.session.currentUser = user;
           res.redirect('/');
         } else {
           res.render("auth/login", {errorMessage: "Incorrect password"});
         }
       }
   });
 });

 authController.get("/logout", (req, res) => {
     req.session.destroy(function(err) {
         res.redirect("/login");
     });
 });

module.exports = authController;
