  
const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")
const User = require("../models/User");
const { count } = require('../models/User');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


//registrar//
router.get("/registrar", async(req, res)=>{
  res.render("registrar")
})


router.post("/registrar", async(req, res, next)=>{
  const {username, email, password}=req.body;
  if(username==="" || email==="" || password===""){
    res.render("registrar",{error : "Missing fields"} )
  }
  const existingUser=await User.findOne({$or:[{username},{email}]})
  if(existingUser){
    res.render("registrar", {error:"Username or Email in use"})
  }
  const salt = bcrypt.genSaltSync(12)
  const hashPass=bcrypt.hashSync(password, salt)
  await User.create({
    username,
    email,
    password:hashPass
  })
  res.redirect("registrar")
})

//login//
router.get("/login", async(req, res)=>{
  res.render("login")
})

router.post("/login", async(req, res, next)=>{
  const {email, password} = req.body;
  if(email === "" || password === ""){
    res.render("login",{error : "Missing fields"} )
  }
  const existingUser=await User.findOne({email})
  if(!existingUser){
    return res.render("login", {error:"Error"})
  }
  if(bcrypt.compareSync(password, existingUser.password)){
    req.session.user=existingUser
    console.log(req.session.user)
    res.redirect("profil")
  }else{
    return res.render("login", {error: "Password doesn't match"})
  }
})


router.get("/profil", (req, res)=>{
  if (req.session.user) {
    res.render("profil", req.session.user)
  } else {
    res.redirect("login")
  }
})

router.get("/main", (req, res)=>{
  res.render("main")
})

router.get("/private", (req, res)=>{
  res.render("private")
})

module.exports = router;