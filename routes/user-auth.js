const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs= require("bcryptjs")
const saltRounds = 10;


router.get("/signup", (req, res, next)=> {
    res.render("auth/signup")
})


router.post("/signup", (req, res, next)=> {
    const {username, email, password} =req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then( salt => {
        return bcryptjs.hash(password, salt)
    })
    .then((hashedPass)=>{
        //console.log( `${hashedPass}`)
        return User.create({
            username: username,
            email:email,
            password: hashedPass
        })
    })

    .then((userCreatedFromDB) => {
        //console.log("New user", userCreatedFromDB)
        res.render("users/user-profile")
    })

    .catch((err) => {
        console.log("Error hashing password", err)
        next(err)

    });   


})

router.get("/userProfile", (req, res, next) => {
    res.render("users/user-profile")
})

module.exports = router;