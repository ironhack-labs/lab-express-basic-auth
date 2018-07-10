const express = require("express");
const authRoutes = express.Router();
const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10; //numero de encripciones

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "tienes que completar la forma con nombre de usuario y password"
    });
    return;
  }

  User.findOne({'username':username},
  'username',(err,user)=>{
    if (user !==null){
      res.render('auth/signup',{
        errorMessage:"este usuario ya está tomado"
      });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser  = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong"
        });
      } else {
        res.redirect("/signup");
      }
    });
  })
});

authRoutes.post("/login", (req,res,next)=>{
  const username = req.body.username;
  const password = req.body.password;

  if (username ===""||password===""){
    res.render("auth/login",{
      errorMessage:"indique un usuario y una contraseña para registrarte"
    });
    return;
  }
User.findOne({"username":username}, (err,user)=>{
  if (err || !user){
    res.render ("auth/login",{
      errorMessage:"el nombre de usuario no existe"
    });
    return;
  }
  if (bcrypt.compareSync(password, user.password)){
    //guarda el login en la session
    req.session.currentUser = user;
    res.redirect ("/");
  } else {
    res.render("auth/login",{
      errorMessage: "contraseña incorrecta"
    });
  }
});
});

module.exports = authRoutes;
