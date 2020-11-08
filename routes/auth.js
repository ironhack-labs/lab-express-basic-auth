
const { genSaltSync } = require("bcrypt")
const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/User.model")
const { Router }=require("express");


router.get("/signup", (req, res) => {
  res.render("auth/signup")
})


router.post ("/signup",async (req,res)=>{
    const {username, password }
= req.body
if(username === "" || password === ""){
    return res.render("auth/signup",{ error:"Missing fields"})
}else{ 

    const salt= bcrypt.genSaltSync(12)
    const hashpwd= bcrypt.hashSync(password, salt)
    
    await User.create ({
        username,
        passwordHash:hashpwd
    })
        res.redirect("/profile")
    }
    
})

router.get("/profile", (req,res)=>{
    res.render("auth/profile")
})

router.get("/login", async(req,res)=>{
   res.render("auth/login")
    })
    
router.post("/login", async (req,res)=>{
    const {username, password}= req.body

    if(username=== ""|| password === ""){
        res.render("auth/login", { error: "missing fields"})
    }

    if (!User){
        res.render("auth/login", { error: "something went wrong"})
    }
    if(bcrypt.compareSync(password, user.password)){

        delete user.password
        req.session.currentUser = user
        res.redirect("/profile")
    } else {
        res.render("auth/login", {error: "something wenth wrong"})
    }
})

router.get("/profile", (req, res)=>{
    res.render("auth/profile", { user: req.session.currentUser})
})

router.get("/login", (req,res) => {
    res.render("auth/login", {user: req.session.currentUser})
})

router.get("/logout", (req,res)=> {
    req.session.destroy()
    res.redirect("/")
})

module.exports = router;