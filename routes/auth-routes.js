

const express = require("express");
const authRoutes = express.Router();
const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Vistas básicas

authRoutes.get("/signup", (req, res, next)=>{
    res.render("basicAuth/signup");
});
authRoutes.get("/login", (req, res, next) => {
    res.render("basicAuth/login");
  });



  authRoutes.post("/signup",(req,res,next)=>{
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    if(username===""||password===""){
        res.render("basicAuth/signup",{
            errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }
    User.findOne({ "username": username },
    "username",
    (err, user) => {
      if (user !== null) {
        res.render("basicAuth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }
  
      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
  
      const newUser = User({
        username,
        password: hashPass
      });
  
      newUser.save((err) => {
        if (err) {
            res.render("basicAuth/signup", {
              errorMessage: "Something went wrong"
            });
          } else {
            res.redirect("/");
          }
      });
    });
});

authRoutes.post("/login",(req,res,next)=>{
    const username= req.body.username;
    const password= req.body.password;
    if(username===""||password===""){
        res.render("basicAuth/login",{
            errorMessage: "Es necesario instroducir nombre de usuario y contraseña para entrar"
        });
        return;
    }

    User.findOne({"username":username},(err,user)=>{
        if(err||!user){
            res.render("basicAuth/login",{
                errorMessage: "El usuario no existe"
            })
            return;
        }
        if(bcrypt.compareSync(password,user.password)){
            req.session.currentUser=user;
            res.redirect("/");
        }else{
            res.render("basicAuth/login",{
                errorMessage: "El password es incorrecto"
            })
        }
    })

})

  module.exports=authRoutes;