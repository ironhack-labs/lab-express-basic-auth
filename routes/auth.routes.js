const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")

const saltRound = 12;


router.get("/signup",(req,res,next)=>{
    res.render("authFolder/signup")
})

router.post("/signup", async (req,res,next) => {
    const {password, confirmPassword, email, username, ...restBody} = req.body
    try {
        if(!username){
            return res.render("authFolder/signup", {errorMessage: "All fields are required"})
        }

        //
        if(!password || !confirmPassword){
            return res.render("authFolder/signup", {errorMessage: "All fields are required"})
        }

        //
        if(password !== confirmPassword){
            return res.render("authFolder/signup", {errorMessage: "Passwords don't match"})
        }

        //
        const found = await User.findOne({ username })
        if (found){
            return res.render("authFolder/signup", {errorMessage: "User already registered"})
        }

        //c
        const salt = bcrypt.genSaltSync(saltRound)

        //
        const passwordHasshed = bcrypt.hashSync(password,salt)

        //
        const userCreated = await User.create({ username, password:passwordHasshed})
        const newUser = userCreated.toObject()
        delete newUser.password

        req.session.currentUser = newUser
        res.redirect("/user/main") 

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: error.message });
          } else if (error.code === 11000) {
            res.status(500).render('auth/signup', {
               errorMessage: 'Username and email need to be unique. Either username or email is already used.'
            });
          } else {
            next(error);
          }
    }
})

router.get("/login",(req,res,next)=>{
	res.render("authFolder/login")
})


router.post("/login", async(req,res,next)=>{
const {username, password} = req.body
try {
    if(!username){
        return res.render("authFolder/login", {errorMessage: "All fields are required"})
    }

    if(!password){
        return res.render("authFolder/login", {errorMessage: "All fields are required"})
    }

    const user = await User.findOne({username})
    if(!user){
        return res.render("authFolder/login", {errorMessage: "Wrong credentials"})
    }

    //
    const match = bcrypt.compareSync(password, user.password)

    if(match){
        const newUser = user.toObject()
        delete newUser.password

        req.session.currentUser = newUser

        res.redirect("/user/main")
        
    } else {
        return res.render("authFolder/login", {errorMessage: "Wrong credentials"})
    }

} catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/login', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/login', {
           errorMessage: 'Username and email need to match our database.'
        });
      } else {
        next(error);
      }
}
})

//user.routes.js

router.get("/main",(req,res,next)=>{
    res.render("user/main")
})

router.get("/logout", (req, res, next) => {
    req.session.destroy((error) =>{
        if(error){
            return next(error)
        }
        res.redirect("/")
    })
})

module.exports = router;