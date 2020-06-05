const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../../models/User.model");

app.get("/signup", (req, res)=>{
    res.render("users/signup");
})

app.post("/signup", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({"username": username})
    .then(user=>{
        if (user !== null){
            res.render("users/signup");
        } else {
            bcrypt.hash(password, 10, function(err, hash) {
                if(err){
                    console.log(err)
                } else {
                    User.create({
                        username: username,
                        password: hash
                    })
                    .then((user)=>{
                        res.redirect("/login")
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
                }
            })
        }
    })
})

module.exports = app;