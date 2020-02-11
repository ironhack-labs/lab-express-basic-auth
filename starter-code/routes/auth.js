const express = require('express');
const authRouter  = express.Router();
const User = require("../models/User");
const saltRounds = 10;

const bcrypt = require("bcrypt");

authRouter.post("/", (req, res, next) => {
    const {username, password} = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    if (password === '' || username === ''){
        res.render('signup', {
            errorMessage: "Username and Password are required"
        });
    return;
    }    

    User.findOne({username})
        .then( user => {
            if (user){
                res.render('signup', {
                    errorMessage: "Username already exists"
                });
                return;
            }
        })

    User.create({username, hashedPassword})
        .then( (createdUser) => {
        res.redirect("/")
          })
        .catch( (err) => console.log(err));
});

authRouter.get("/", ( req, res, next) => {
    res.render('signup')
});

module.exports = authRouter