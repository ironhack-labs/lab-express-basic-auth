const express = require('express');
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(256);

//This are my routes

//Sign Up route
router.get('/signup', (req,res)=>{
  res.render('signup_form', {error:null});
})

router.post('/signup', (req,res)=>{
  User.findOne({userName: req.body.userName}, (error, doc)=>{
    if(doc)
    return res.render('signup_form', {error: `The username can't be repeated.`})
  });
  const hash = bcrypt.hashSync(req.body.password, salt);
  const user = new User({
    userName: req.body.userName,
    password: hash
  });
  console.log(user)
  user.save((err, result)=>{
    if(!err){
      return res.redirect('/');//cambia esto por el perfil
    }
    
  });
});

//Login route
router.get("/login", (req,res)=>{
  if(req.session.currentUser){
    return res.redirect("/private");
  }
  res.render("login_form", {error:null})
});

router.post("/login", (req,res)=>{
  User.findOne({userName:req.body.userName}, (err,doc)=>{
    if(err) return res.render("login_form", {error:"tu nombre de usuario es incorrecto"})
    if(bcrypt.compareSync(req.body.password, doc.password)){
      req.session.currentUser = doc;
      res.redirect("/private");
    }
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home Page' });
});

module.exports = router;