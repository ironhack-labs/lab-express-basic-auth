const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../../models/User.model");

app.get("/login", (req, res)=>{
    res.render("users/login");
})

app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({"username": username})
    .then(user=>{
        if (!user){
            res.redirect("/signup");
        } else {
            bcrypt.compare(password, user.password, (err, match)=>{
                if (err){
                    console.log(err);
                } else if (match){
                    req.session.user = user;
                    res.redirect("/")
                } else {
                    res.redirect("/signup");
                }
            })
        }
    })
})

module.exports = app;