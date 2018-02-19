var express = require('express');
var router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

router.get("/signup", (req,res)=>{
    res.render("users", {error:null});
  });
  router.post("/signup", (req,res)=>{
    if (req.body.password === "" || req.body.username === "" || req.body.password2 === "" ){
        return res.render("users", {error:"You need complete all the fields! Please, try again."})
    }
    if(req.body.password2 !== req.body.password){
      return res.render("users", {error:"Your passwords don't match! Duh!"})
    }
    User.findOne({username:req.body.username}, (err,doc)=>{
      if(doc){
        return res.render("users", {error:"This username is already taken."})
      }
    });
    const hash = bcrypt.hashSync(req.body.password, salt);
    const user = new User({
      username: req.body.username,
      password: hash,
    });
    user.save((err,result)=>{
      if(!err){
        return res.redirect("/signup");
      }
    });
});

router.get("/login", (req,res)=>{
    if(req.session.currentUser){
      return res.redirect("/login");
    }
    res.render("login_form", {error:null})
});
  
router.post("/login", (req,res)=>{
    console.log("Hola post login");
    User.findOne({username:req.body.username}, (err,doc)=>{
      if(err) return res.render("login_form", {error:"Incorrect username"})
      if(bcrypt.compareSync(req.body.password, doc.password)){
        req.session.currentUser = doc;
        res.redirect("/");
      }
    });
});

router.get("/main", (req,res)=>{
      if(req.session.currentUser){
        return res.render("main");
      }
      return res.redirect("/users/login");
});

router.get("/private", (req,res)=>{
    if(req.session.currentUser){
      return res.render("private");
    }
    return res.redirect("/users/login");
});

router.get("/logout", (req,res)=>{
    req.session.destroy();
    res.redirect("/users/login");
});

module.exports = router;