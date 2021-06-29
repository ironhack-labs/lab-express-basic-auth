const express = require("express");
const authRouter = express.Router();
const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const saltRounds = 16;

const zxcvbn = require("zxcvbn");


authRouter.get("/signup", (req, res) => {
    res.render("auth-views/signup-form");
});
  
// POST    '/auth/signup'
authRouter.post("/signup", (req, res, next) => {

    const { username, password } = req.body;

    if (username === "" || password === "") {
        res.render("auth-views/signup-form", {
        errorMessage: "Username and Password are required.",
        });
        return;
    }

    const passwordStrength = zxcvbn(password).score;

    // console.log("zxcvbn(password) :>> ", zxcvbn(password));
    // console.log("passwordStrenth :>> ", passwordStrength);
    if (passwordStrength < 3) {
        res.render("auth-views/signup-form", {
        errorMessage: zxcvbn(password).feedback.warning,
        });
        return;
    }

    User.findOne({ username })
        .then((userObj) => {
        if (userObj) {
            res.render("auth-views/signup-form", {
            errorMessage: `Username ${username} is already taken.`,
            });
            return;
        } else {
            
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            User.create({ username, password: hashedPassword })
            .then((user) => {
                console.log("Congratulations! You have successfully registered!")
                res.redirect("/");
            })
            .catch((err) => {
                res.render("auth-views/signup-form", {
                errorMessage: `Error during signup`,
                });
            });
        }
        })
        .catch((err) => next(err));
});

module.exports = authRouter;