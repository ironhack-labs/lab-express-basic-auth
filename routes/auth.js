const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
    res.render("auth/signUp")
});

router.post("/signup", (req, res, next) => {
    
    const {username, password} = req.body;

    if (username === "" || password === "") {
        res.render("auth/signUp", {
            errorMessage: "Please, indicate a username and a password."
        });
        return;
    }
    User.findOne({ username })
        .then((user) => {
            if (user !== null) {
                res.render("auth/signUp", {
                    errorMessage : "This user already exists."
                });
                return;
            }
            
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            User.create({ username, password: hashPass})
                .then (() => {
                    res.redirect("/");
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            next(error);
        });
});

router.get("/login", (req, res, next) => {
    res.render("auth/login")
});

router.post("/login", (req, res, next) => {

    const {username, password} = req.body;

    if (username === "" || password === "") {
        res.render("auth/login", {
            errorMessage: "Please, enter username and password to login."
        });
        return;
    }
    User.findOne({username})
        .then((user) => {
            if(!user) {
                res.render("auth/login", {
                    errorMessage: "This username doesn't exists."
                });
                
            }
            const correctPass = bcrypt.compareSync(password, user.password);
            //console.log(correctPass)
            if (!correctPass) {
                res.render("auth/login", {
                    errorMessage: "Incorrect password."})
            } else {
                req.session.currentUser = user;
                res.redirect("/")
            }
        })
    .catch ((error) => {
        next(error);
    })
});

module.exports = router;