const express = require("express");
const app = express();
const User = require("../models/User");
const bcrypt = require('bcrypt');

app.get("/login", (req,res)=> {
    res.render("user/login");
})

app.post("/login", (req,res,next)=> {
    const {username, password} = req.body;
    User.findOne({
        username 
    })
    .then((user)=> {
        if(!user) res.send("invalid credentials.")
        else {
            bcrypt.compare(password, user.password, function(err, correctPassword) {
                if(err) next(" error");
                else if(!correctPassword) res.send("invalid credentials.");
                else {
                    req.session.currentUser = user;
                    res.redirect("/profile");
                }
            });
        }
    })
    .catch((err)=> {
        res.send("Error, not logged in.")
    })
})



module.exports = app;