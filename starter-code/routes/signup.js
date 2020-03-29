const express = require("express");
const app = express();
const User = require("../models/User");
const bcrypt = require('bcrypt');

app.get("/signup", (req,res)=> {
    res.render("user/signup");
})

app.post("/signup", (req, res) => {
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

module.exports = app;