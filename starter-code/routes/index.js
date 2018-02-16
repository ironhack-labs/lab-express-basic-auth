var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const User = require("../models/User");


//Route Sign-up
router.get("/signup", (req,res)=>{
  console.log("No");
 res.render("signup-form",{error:null});
});

router.post("/signup", (req,res)=>{
  if(req.body.password !== req.body.password2) {
    return res.render("signup-form", {error:"Tu password no coincide "})
  }
  User.findOne({userName:req.body.userName}, (err,doc)=>{
    if(doc){
      return res.render("signup-form", {error:"Este correo ya se está usando"})
    }
  });
  const hash = bcrypt.hashSync(req.body.password, salt);
  const user = new User({
    userName: req.body.userName,
    password: hash
  });
  user.save((err,result)=>{
    if(!err){
      console.log("guardado");
      return res.redirect("/");
    }
  });

});






module.exports = router;