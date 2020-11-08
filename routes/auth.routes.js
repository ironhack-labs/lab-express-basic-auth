const express = require('express');
const router = express.Router();
const {genSaltSync}= require('bcrypt');
const bcrypt= require("bcrypt");
const User=require("../models/User.model")

router.get("/signup", (req,res) => {
    res.render("auth/signup")
})
router.post("/signup", async (req,res)=>{
    const{username, password}=req.body
    if(username===""|| password===""){
        return res.render('auth/signup',{error:"Missing fiels"})
    }else{
        const user= await User.findOne({username})
        if(user){
            return res.render('auth/signup', {error: "something went wrong"})
        }
        const salt= bcrypt.genSaltSync(12)
        const hashpwd=bcrypt.hashSync(password, salt)
        await User.create({username, password:hashpwd})
        console.log(hashpwd)
        res.redirect("/profile")
    }
})

router.get('/profile', (req, res)=>{
    res.render('auth/profile', { user: req.session.currentUser } )
})

router.get("/login", (req, res)=>{
    res.render('auth/login')
})

router.post('/login', async (req, res)=>{
    const {username, password}= req.body
    if(username==""||password===""){
        res.render("auth/login", {error:"Missing fields"})
    }
    const user= await User.findOne({username})
    if(!user){
        res.render("auth/login", {error:"something went wrong"})
    }
    if(bcrypt.compareSync(password, user.password)){
        delete user.password
        req.session.currentUser= user
        res.redirect("/profile")

    }else{
        res.render("auth/login",{user:"something went wrong"})
    }
})

router.get("/profile", (req, res)=>{
    res.render("auth/profile", {user:req.session.currentUser})
})

router.get("/logout", (req, res)=> {
    req.session.destroy()
    res.redirect("/")
})
router.get('/main', (req,res)=>{
    res.render('auth/main')
})

router.get('/level1', (req, res)=>{
    res.render('auth/level-1')
})
router.get('/level2', (req, res)=>{
    res.render('auth/level2')
})
router.get('/level3', (req, res)=>{
    res.render('auth/level3')
})

router.get('/level4', (req, res)=>{
    res.render('auth/level4')
})
router.get('/private', (req, res)=>{
    res.render('auth/private')
})

module.exports= router;