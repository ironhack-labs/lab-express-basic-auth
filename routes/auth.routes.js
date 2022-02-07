const router = require("express").Router()
const bcryptjs = require("bcryptjs")

const User = require("../models/User.model")
const saltRounds = 10

//SIGN UP render
router.get("/sign-up", (req, res, next) => res.render("auth/signup"))

//handle
router.post("/sign-up", (req, res, next) => {
    const { username, passwordIn } = req.body
    if (username.length === 0 || passwordIn < 6) {
        res.render("auth/login", { errorMsg: "Username cannot have 0 characters and password must have more than 6" })
        return
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(passwordIn, salt))
        .then(hashedPassword => User.create({ username, password: hashedPassword }))
        .then(newUser => res.redirect("/"))
        .catch(error => next(error))
})

//LOGIN render
router.get("/login", (req, res, next) => res.render("auth/login"))

//handle
router.post("/login", (req, res, next) => {
    const { username, passwordIn } = req.body

    if (username.length === 0 || passwordIn < 6) {
        res.render("auth/login", { errorMsg: "Username cannot have 0 characters and password must have more than 6" })
        return
    }

    User
    .findOne({username})
    .then(user =>{
        if(!user){
            res.render("auth/login", {errorMsg: "No username with this nick in DB"})
            return
        } else if(bcryptjs.compareSync(passwordIn, user.password) === false){
            res.render("auth/login", {errorMsg:"Forgot the password?"})
            return
        } else {
            req.session.currentUser = user
            console.log("El objeto de EXPRESS-SESSION", req.session)
            res.redirect("/")
        }
    })
})







module.exports = router;