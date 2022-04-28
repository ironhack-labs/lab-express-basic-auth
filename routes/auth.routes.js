const { Router } = require("express")
const bcryptjs = require ("bcryptjs")
const mongoose = require ("mongoose")

//require custom middleware
const {isLoggedIn, isLoggedOut} = require("../middleware/route-guard.js")

const saltRounds = 10
const router = new Router()

const User = require("../models/User.model")
const res = require("express/lib/response")

router.get("/signup", isLoggedOut, (req,res,next)=>{
    res.render("auth/signup")
})

router.post("/signup", (req,res,next)=>{
    const { username, email, password } = req.body

    if (!username || !email || !password){
        res.render("auth/signup",{errorMessage: "Please fill all the fields"})
        return
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(!regex.test(password)){
        res.status(500).render("auth/signup", {
            errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.'
        })
        return
    }

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
        return User.create({username, email, password: hashedPassword })
    })
    .then(dbUser => res.redirect("/userProfile"))
    .catch(err => {
        if (err instanceof mongoose.Error.ValidationError){
            res.status(500).render("auth/signup",{errorMessage: err.message})
        } else if(err.code === 11000){
            console.log("error",err)
            res.status(500).render("auth/signup",{
                errorMessage: "Username and email need to be unique. Either username or email is already used."})
        }
        else{
            next(err)
        }
    })
})

router.get("/userProfile", isLoggedIn, (req,res,next)=>{
res.render("users/user-profile",{userInSession: req.session.currentUser})
})

router.get("/login", isLoggedOut, (req,res,next)=>{
    res.render("auth/login")
})

router.post("/login",(req,res,next)=>{
    console.log("Session ===>", req.session)
    const { email, password} = req.body

    if (email === "" || password === ""){
        res.render("auth/login",{errorMessage: "Please enter both, email and password to login."})
        return
    }

    User.findOne({email})
    .then(user=>{
        //Para que user aparezca en session
        //req.session.currentUser = user;
        if(!user){
            res.render("auth/login",{errorMessage: "Email is not registered."})
            return
        } else if(bcryptjs.compareSync(password, user.password)){
            //res.render("users/user-profile",{user})
            //Save User in session
            req.session.currentUser = user;
            res.redirect("/userProfile")
        } else {
            res.render("auth/login",{errorMessage: "Incorrect Password"})
        }
    })
    .catch(err=>next(err))
})  

router.post("/logout",(req,res,next)=>{
    req.session.destroy(err=>{
        if(err) next(err);
        res.redirect("/")
    })
})

router.get("/main", isLoggedIn, (req,res,next)=>{
    res.render("main")
})

router.get("/private", isLoggedIn, (req,res,next)=>{
    res.render("private")
})

module.exports = router