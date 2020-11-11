const { Router } = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = Router();
const express = require('express');

const User = require("../models/User.model");

router.get("/signup", (req,res,next) => res.render("auth/signup"));

router.post("/signup", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password){
        res.render("auth/signup", { errorMessage: "⛔️ Fields cannot be empty! ⛔️" });
        return;
    }

    User.findOne({ username })
        .then((results) => {
            if (results !== null) {
                res.render("auth/signup", {
                    errorMessage: "⛔️ This username already exists! ⛔️",
                });
                return;
            }

            bcrypt
                .hash(password, 10)
                .then((hashedPassword) => {
                    const newUser = new User({
                        username, 
                        password: hashedPassword,
                    });

                    newUser
                        .save()
                        .then(()=> res.redirect("/"))
                        .catch((err) => next(err));
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
});



module.exports = router;
