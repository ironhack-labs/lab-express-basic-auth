const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);


router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', (req, res)=>{
  res.render('login_form');
});

router.get('/signup', (req, res) => {
    var error=false;
  res.render('signup_form',{error});
});

router.post("/signup", (req,res)=>{
    var error=false;
    //checamos si el usuario no esta sonso
    if(req.body.password2 !== req.body.password){
      return res.render("signup_form", {error:"Tus password no coinciden duh!"})
    }
    User.findOne({userName:req.body.userName}, (err,doc)=>{
      if(doc){
        return res.render("signup_form", {error:"Este correo ya se está usando"})
      }
    });
    const hash = bcrypt.hashSync(req.body.password, salt);
    const user = new User({
      userName: req.body.userName,
      password: hash,
    });
    user.save((err,result)=>{
      if(!err){
        return res.redirect("/");
      }
    });
  
  });


module.exports = router;