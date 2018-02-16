var express = require('express');
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

//signup route

router.get("/signup", (req,res)=>{
    res.render("signup_form", {error:null});
  });
  router.post("/signup", (req,res)=>{
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
//pagina de inicio
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Basic Auth' });
  });

module.exports = router;