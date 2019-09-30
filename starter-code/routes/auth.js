const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const express = require("express");
const router = express.Router();



router.get("/signup", (req, res, next) => {
    res.render("signup");
});

router.post("/signup", (req, res, next) => {

    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    if (username === "" || password === "") {
        console.log("errror")
        res.render("signup", {
            
         errorMessage: "Indicate a username and a password to sign up"
        });
        return;
      }
    

    User.create({
        username,
        password: hashPass
    })
        .then(() => {
            res.redirect("/");
        })
        .catch(error => {
            console.log(error);
        })
});

module.exports = router;