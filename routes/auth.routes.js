const User = require("../models/User.model");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const {isLoggedOut, isLoggedIn} = require("../middleware/route.guard")



//Sign UP

router.get("/signup", isLoggedOut, (req, res, next) => res.render("auth/signUp"));

router.post("/signup", async (req, res, next) => {
    const {username, password} = req.body;
    
    try {
        if(!username || !password) {
            res.render("auth/signUp", {errorMessage: "Please insert an username and password"});
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt)
        const createdUser = await User.create({username, password: hashPass})
        res.redirect("/profile");
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError){
            res.status(500).render("auth/signUp", {errorMessage: error.message})
        }
        else if (error.code === 11000) {
        res.status(500).render('auth/signUp', {errorMessage: 'Username already exists'});
        }

        next(error);
    }
})

//log in

router.get("/login", isLoggedOut, (req, res, next) => res.render("auth/logIn"));

router.post("/login", async (req, res, next) => {
    const {username, password} = req.body;

    try {
        if(!username || !password) {
            res.render("auth/login", {errorMessage: "Please insert an username and password"});
            return;
        }
        
        const user = await User.findOne({username})
        if(!user){
            res.render("auth/login", {errorMessage: "Wrong Username or Password, try your cat's name"});
        }
        else if (await bcrypt.compare(password, user.password)){
            req.session.user = user;
            res.redirect("/profile");
        }
    
    } catch (error) {
        console.log(error);
        next(error);
    }
})

//log out

router.post("/logout", (req, res, next) =>{
    if(!req.session.user) {
        res.redirect("/");
        return;
    }
    req.session.destroy(err =>{
        if (err) next(err);
        else res.redirect("/");
    })
})

//profile page

router.get("/profile", isLoggedIn, (req, res, next) => res.render("profile", req.session.user));

//games page

router.get("/mygames", isLoggedIn, (req, res, next) => res.render("games", req.session.user))


module.exports = router;