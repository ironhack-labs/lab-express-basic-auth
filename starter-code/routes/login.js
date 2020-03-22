const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/login", (req,res,next) => {
    const theUsername = req.body.username
    const thePassword = req.body.password

    if(theUsername === "" || thePassword === "") {
        res.render("login", {
            errorMessage: "Please enter both username and password to sign up."
        })
        return
    }    
    
    User
    .findOne({"username": theUsername})
    .then((user) => {
        if(!user) {
            res.render("login", {errorMessage: "The username doesn't exist."})
        }
        return
        }
    
        if(bcrypt.compareSync(thePassword, user.password)) {
            req.session.currentUser = user
            res.redirect("/")
        } else {
        res.render("login", {errorMessage: "Incorrect password"})
        }
    }
    )
    .catch(error => {
        next(error)
    })


module.exports = router;