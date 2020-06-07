/*jshint esversion: 6 */

const express = require("express");
const app = express();
const User = require("../../models/User.model");
const bcrypt = require('bcrypt');



app.post("/user/signup", (req, res) => {
    User.findOne({username: req.body.username})
    .then((user)=> {
        if(user){
            res.redirect("/user/signup?error=Username+Taken");
        }
        else {
            bcrypt.hash(req.body.password, 10, function(err, hash){
                if(err){
                    console.log("Hashing error", err);
                } else {
                    User.create({
                        username: req.body.username,
                        password: hash
                    })
                    .then((user)=> {
                        res.redirect("/user/login")
                    })
                    .catch((err)=> {
                        console.log(err);
                    })
                }
            })
        }
    })

})

app.get("/user/signup", (req,res) => {
    if(req.query.error){
        res.render("user/signup", {error: true, message: req.query.error});
    } else {
        res.render("user/signup");
    }
})

module.exports = app;