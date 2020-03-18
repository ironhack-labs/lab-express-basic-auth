const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

router.get("/", (req,res)=> {
    res.render("user/signup");
})

router.post("/", (req, res) => {
    const { username, password } = req.body;
    User
        .findOne({ "username": username })
        .then(user => {
            if (user !== null) {
                res.render("user/signup.hbs", {
                    errorMessage: "The username already exists!"
                })
            }
            else {
                bcrypt.hash(password, 10, function (err, hash) {
                    if (err) next("hashing error");
                    else {
                        User
                            .create({
                                username: username,
                                password: hash
                            })
                            .then((user) => {
                                res.redirect("/login");
                            })
                            .catch((err) => {
                                res.send("user not created", err);
                            })
                    }
                })
            }
        })
    })

module.exports = router;