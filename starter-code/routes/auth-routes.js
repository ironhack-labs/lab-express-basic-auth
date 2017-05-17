const express = require("express");
const authRoutes = express.Router();



const User           = require("../model/user");

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
    }
    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);


    User.findOne({"username": username},
      "username",
    (err, user)=>{
      if(err){
        next(err);
        return;
      }
      if(user !== null){
        res.render("auth/signup",{
          errorMessage:"The user namer already exists stupid"
        });
        return;
      }
      var newUser = User ({
        username,
        password : hashPass
      });

      newUser.save((err)=>{
        if(err){
          res.render("auth/signup",{
            errorMessage:" Something went wrong stupid human"
          });
        }else{
          res.redirect("/");
        }
      })

    })




});

authRoutes.get("/login",(req, res, next) =>{
  res.render("auth/login");

})

authRoutes.post("/login", (req , res, next)=>{
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
    }
    User.findOne({"username": username}, (err , user)=>{
      if(err || !user){
        res.render("auth/login",{
          errorMessage: "stupid human you dont have fucking idea!!!!!!"
        });
        return;
      }
    if( bcrypt.compareSync(password, user.password)){
      req.session.currentUser = user;
      res.redirect("/");
      }
    })


})

authRoutes.get("/logout", (req, res, next)=>{
  req.session.destroy((err)=>{
    res.redirect("/login");
  })
})











module.exports = authRoutes;
