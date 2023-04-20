const router = require("express").Router();
const { isLoggedIn } = require('../middleware/route-guard');
const express=require('express');
const User=require('../models/User.model')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/profile",(req,res,next)=>{
const user=req.session.user
res.render("profile",{user:user})
})

router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main");
});

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private");
});
router.get("/login",(req,res,next)=>{
  res.render("auth/login")
})

router.post("/login",(req,res,next)=>{
  const {username,password}=req.body
  User.findOne({username})
    .then((user)=>{
      if(!user){
        res.redirect('/login')
        return
      }
      if(user.password !== password){
        res.redirect('/login')
        return
      }
      req.session.user = user
      res.redirect('/main')
    })
    .catch((err)=>{
      console.log(err)
    })
  })
module.exports = router;