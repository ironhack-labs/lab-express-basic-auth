const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');


router.get("/main", (req,res)=> res.render("main"))

router.get("/signup", (req, res) => res.render("signup"));

router.post("/signup", async (req, res, next) => {
    try {
        let { username, password } = req.body;
        if (!username || !password) {
            res.render("signup", {
                errorMessage: "Please input all the fields",
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await User.create({ username, password:hash });
        res.redirect("/login");
    } catch (error) {
        console.log(error);
        next(error);
    }
});


router.get("/login", isLoggedOut, (req, res) => res.render("login"));

router.post("/login", async (req, res)=> {
    try {
        let {username, password} = req.body;
        if(!username || !password){
            res.render("login", {errorMessage: "Please input all the fields"})
        }
        let user = await User.findOne({username})
        if(!user){
            res.render("login", {errorMessage: "Username not found!"})
        }else if(bcrypt.compare(password, user.password)){
            req.session.user = user
            res.redirect("/profile")
        }else{
            res.render("login", {errorMessage: "wrong credentials"})
        } 
        
    } catch (error) {
        console.log(error)
        next(error)        
    }
})

router.get("/profile", isLoggedIn, (req,res, next)=> {
    let user = req.session.user;
    res.render("profile", user)
})

router.post("/logout", (req, res, next)=> {
    
    req.session.destroy((error)=> {
        if(err) next(err)
        else res.redirect("/")
    })
}) 

router.get("/private", isLoggedIn, (req,res)=> res.render("private"))

module.exports = router;