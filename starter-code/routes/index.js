var express = require('express');
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");



//Route Sign-up
router.get("/signup", (req,res)=>{
 res.render("signup-form",{error:null});
});

router.post("/signup", (req,res)=>{
  User.findOne({userName:req.body.userName}, (err,doc)=>{
    if(err) return res.send(err);
    if(doc) return res.render("signup-form", {error:"Este correo ya se está usando"})

    if(req.body.password !== req.body.password2) {
    return res.render("signup-form", {error:"Password doesn´t match"})
  }
  });
 
  //Hash password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  //New User
  const user = new User({
    userName: req.body.userName,
    password: hash
  });
  user.save((err,result)=>{
    if(err) return res.send(err);
    return res.redirect("/login"); //user profile
   });

});

//Home Page
router.get("/",function(req,res){
  res.render("index");
});


//Login
router.get("/login", (req,res)=>{
  res.render("login_form", {error:null});
});

router.post("/login", (req,res)=>{
  User.findOne({userName:req.body.userName}, (err,doc)=>{
    if(err) return res.send(err);
    if(!doc) return res.render("login_form",{error:"User not found"});
    if(!bcrypt.compareSync(req.body.password, doc.password)) return res.render("login_form",{error:"Incorrect password"});
    req.session.currentUser = doc;
    res.redirect("/"); //user profile
  });
});

//User Listing
router.get("/", function(req,res,next){
  res.send("respond with a resource");
});

module.exports = router;



