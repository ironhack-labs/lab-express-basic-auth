const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")

router.get("/auth/signup", (req, res, next) => {
    res.render("signup")
})

router.post("/auth/signup", (req, res, nex) => {
    const {username, password} = req.body

    //validation

    if(username === "") {
        res.render("signup", {message: "Username can not be empty!"})
        return
    }

    if(password.length < 4) {
        res.render("signup", {message: "Password can not be shorter than 4 characters."})
        return
    }


    //check if username is available

    User.findOne({username})
        .then(user => {
            if(user !== null){
                res.render("signup", {message: "Username already taken."})
            }

            //if username available hash password
            else {
                const salt = bcrypt.genSaltSync()
                const hash = bcrypt.hashSync(password, salt)

            //create User

            User.create({username: username, password: hash})
                .then(newUser => {
                    res.redirect("/auth/login")
                })
                .catch(err => {next(err)})
            }
        })
        .catch(err => {next(err)})

})

router.get("/auth/login", (req, res, next) => {
    res.render("login")
})

router.post("/auth/login", (req, res, next) => {
    const {username, password} = req.body
    
    //Find user
    User.findOne({username})
        .then(user => {
            //check if user exists
            if(user === null) {
                res.render("login", {message: "User not found"})
                return
            }

            //if user exists, check if password matches
            if(bcrypt.compareSync(password, user.password)) {
                req.session.user = user
                req.session.user.password = null
                res.redirect("/profile")
            }
            else {
                res.render("login", {message: "Wrong password"})
                return
            }

        })

})

module.exports = router