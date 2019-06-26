const express=require('express')
const router=express.Router()

userModel=require("../models/user")
// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
  
// SIGNUP 
router.get("/signup", (req, res, next) => {
    res.render('auth/signup')
})


router.post("/signup", (req, res, next)=>{
    const {username, password}=req.body;
    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

        // form validation 
        if (username ==="" || password ===""){
            res.render("auth/signup", {errorMessage : "Indicate a username and a password in order sign up "})
            console.log("empty signup")
            return
            }
        // user creation in db 
        else{
            userModel.findOne({"username": username})
            .then(
                user => {
                    if (user!== null){ 
                        res.render({errorMessage: "Users already exists !"})
                    }
                    else{
                    userModel.create({username, password : hashPass})
                    .then( () => {res.redirect("/");})
                    .catch(err => console.log(`error while creating a new user:  ${err}`))
                    }
            })
        }
})


// SIGN IN
router.get("/login", (req, res, next) => {
    res.render('auth/login')
    console.log("login page !")
})


router.post("/login", (req, res, next) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;

    console.log("theuser name = ", theUsername, " thePwd  =  ", thePassword)

    // form validation 
    if (theUsername ==="" || thePassword ===""){
        console.log("Indicate a username and a password in order log in ")
    res.render("auth/signup", {errorMessage : "Indicate a username and a password in order log in "})
    return
    }

    // verifies  user exists
    userModel.findOne({"username": theUsername})
        .then( user =>{
            console.log(user)
            console.log("user.username : " ,  user.username, "user.pwd = ", user.password)
            if (!user){res.render("auth/login", {errorMessage: "User does not exist, please sign up !"})
                      return }
            if(bcrypt.compareSync(thePassword, user.password)){
                req.session.currentUser=user //save session 
                res.redirect("/") // redirect to home
            }
            else{
                res.render("auth/login", {errorMessage: "Invalid password"})
            }    
       })
       .catch(err => next(err))
})


module.exports = router;