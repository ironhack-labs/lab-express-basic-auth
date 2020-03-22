const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/signup", (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password,salt)

    if(username === "" || password === "") {
        res.render("signup", {errorMessage: "Indicate a username and a password to sign up"})
        return
    }

    User
    .findOne({"username" : username})
    .then(user => {
        if(user !== null) {
            res.render("signup", {errorMessage: "Indicate a username and a password to sign up"})
        }
        return
    })

        User
        .create({
            username,
            password: hashPass
        })
        .then(() => {
            res.redirect("/")
        })
        .catch(error => {
            console.log("error")
        })
    
    .catch((error) => {
        console.log(error)
    }
});

module.exports = router;
