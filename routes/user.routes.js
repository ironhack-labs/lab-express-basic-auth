const express = require('express');
const router = express.Router();

const bcrypt = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLogged");

router.get("/login", isLoggedOut, (req, res, next)=> {
    console.log("REQ.SESSION: ", req.session);
    res.render("user/login");
})
  
router.post("/login", isLoggedOut, (req, res, next)=>{
    
    let {username, password} = req.body;
  
    if(username == "" || password == "") {
      res.render("user/login", { error: "Faltan campos" });
      return;
    } 
  
    User.find({username})
    .then(results => {
      if(results.length == 0) {
        res.render("user/login", { error: "Credenciales incorrectas" });
        return;
      }
  
      if(bcrypt.compareSync(password, results[0].password)) {
        req.session.currentUser = username; 
        res.render("index", {exito: "Bienvenido, te has loggeado..."});
      } else {
        res.render("user/login", { error: "Credenciales incorrectas" });
      }
    })
    .catch(err => next(err));
})

router.post("/register", (req, res, next) => {
  let {username, password, passwordRepeat} = req.body;

  if(username == "" || password == "" || passwordRepeat == "") {
    res.render("user/register", {error: "Los campos no pueden estar vacíos..."});
    return;
  }
  else if(password != passwordRepeat) {
    res.render("user/register", {error: "Las contraseñas no coinciden..."});
    return;
  }
  
  User.find({username})
  .then(results => {
    console.log("results ", results);

    if(results.length != 0) {

      res.render("user/register", {error: "El usuario ya existe"});
      return;
    }
    let salt = bcrypt.genSaltSync(saltRounds);
    let passwordEncriptado = bcrypt.hashSync(password, salt);

    User.create({
      username: username, 
      password: passwordEncriptado
    })
    .then(result => {
      res.render("user/login", {exito: "¡El usuario se ha creado con éxito!"});
    })
    .catch(err => next(err))
  })
  .catch(err => {
    console.log("err ", err);
    next(err);
  })
  
})

router.get("/register", (req,res,next)=>{
res.render("user/register")
})


router.get("/logout", isLoggedIn, (req, res, next)=>{
    req.session.destroy(err => {
      if(err) next(err);
      else res.redirect("/");
    });
});


module.exports = router;