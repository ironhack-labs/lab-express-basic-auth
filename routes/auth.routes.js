const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model")
const saltRounds = 10;


router.get("/signup", (req, res, next)=>{
    res.render("auth/signup");
});



router.post("/signup", (req, res, next)=>{
    const {email, password} = req.body;
    bcryptjs
    .genSalt(saltRounds)
    .then((salt)=>{
        return bcryptjs.hash(password, salt)
    })
    .then((hash)=>{
        const userDetails = {
            email,
            passwordHash: hash
        }
        return User.create(userDetails)
    })
    .then(userFromDB => {
        res.redirect("/");
    })
    .catch(e => {
        console.log("error generating hash", e)
        next()
    })
})


router.get("/login", (req, res, next)=>{
    res.render("auth/login")
})


router.post("/login", (req, res, next)=>{
    const {email, password} = req.body;
    if(!email || !password){
        res.render("auth/login", {errorMessage: "Please provide a valid email and password to login"})
    }
    User.findOne({email: email})
    .then(userFromDB=>{
        if(!userFromDB){
            res.render("auth/login", {errorMessage: "Email is not registered. Sign up first or try with a registered email"})
        }
        else if(bcryptjs.compareSync(password, userFromDB.passwordHash)){
            req.session.currentUser = userFromDB;
            res.render("users/profile", {userInSession: req.session.currentUser})
        }
        else{
            res.render("auth/login", {errorMessage: "Incorrect credentials."});
        }
    })
    .catch(error => {
        console.log("Error getting user details from DB", error)
        next()
    })

})



module.exports = router;