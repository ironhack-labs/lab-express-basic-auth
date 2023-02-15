const express = require("express");

const router = express.Router();

const bcrypt = require("bcrypt");

const mongoose = require("mongoose");


const User = require("../models/User.model");

const isLoggedOut = require("../middleware/isLoggedOut");

const isLoggedIn = require("../middleware/isLoggedIn");

// Signup routes

router.get("/signup",(req,res,next) => res.render("auth/signup")) ;

router.post("/signup", async(req,res,next) => {
    try {
        let {username, password} = req.body;

        if(!username || !password) {
            res.render("auth/signup", {errorMessage: "Please input all the fields"});
        }
    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password,salt);

    await User.create({ username, password: hashedPassword});
    res.redirect("/index");
    
    } catch (error) {
        if(error instanceof mongoose.Error.ValidationError)
        console.log(error)
        next(error)
    }  if (error.code === 11000) { 
        res.render("auth/signup",{errorMessage: "User already registed"})
} 
})


//Login routes and session 

router.get("/login", async(req,res,next) => res.render("auth/login")) ;

router.post("/login", async(req,res,next) => {
    try {
        let {username, password} = req.body;
        if(!password || !username) {
            res.render("auth/login", {errorMessage: "Please input all the fields"});
        }
        let user = await User.findOne({username})

        if(!user) {
            res.render("auth/signup", {errorMessage: "Account does not exist"
        });


     } else if (bcrypt.compareSync(password, user.password)) {
            
            req.session.user = user 
            res.redirect("/profile");
        } else {

            res.render("auth/login", {errorMessage:"Wrong credentials"})
        }

    } catch (error) {
        
        console.log(error)
        next(error)
    }  
    })


// //Regex

//     const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

//     regex.test(password) 
    
//     if(!regex.test(password)) {
//     res.render("auth/signup", {errorMessage: "Your password does not match the requirements"
//     });
//     }

//     const salt = await bcrypt.genSalt(10)

//     const hashedPassword = await bcrypt.hash(password)

//     res.redirect("/")


//Profile

router.get("/profile", isLoggedIn,(req,res) => {
    let user = req.session.user;
    res.render("/profile", user);
});

router.post("/logout",  (req,res,next) => {
    req.session.destroy((err) => {
        if(err) next(err)
        else res.redirect("/") 
    })
})



  module.exports = router;