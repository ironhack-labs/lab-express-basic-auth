const express = require("express");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const router = express.Router();

const SALT = 10;


router.get("/signup", (req, res, next) => {
    res.render("signup.hbs");
});

router.post("/signup", async(req, res, next) => {
    try {
        const user = req.body;

        if (!user.password || !user.username) {
            res.render("signup.hbs", {
                errorMessage: "Please provide an username and a password",
            });
            return;
        }

        const foundUser = await User.findOne({ username: user.username });

        if (foundUser) {
            res.render("signup.hbs", {
                errorMessage: "User name already exists !",
            });
            return;
        }

        const hashedPassword = bcrypt.hashSync(user.password, SALT);
        user.password = hashedPassword;

        const createdUser = await User.create(user);

        res.redirect("/auth/signin");
    } catch (error) {
        console.log(error);
        next(error);
    }
});


router.get("/signin", (req, res, next) => {
    res.render("signin.hbs");
});


router.post("/signin", async(req, res, next) => {
    try {
        const foundUser = await User.findOne({ username: req.body.username });

        if (!foundUser) {
            res.render("signin.hbs", {
                errorMessage: "Wrong",
            });
            return;
        }

        const isValidPassword = bcrypt.compareSync(
            req.body.password,
            foundUser.password
        );

        if (isValidPassword) {
            req.session.currentUser = {
                _id: foundUser._id,
            };

            res.redirect("/");
        } else {
            res.render("signin.hbs", {
                errorMessage: "Bad credentials",
            });
            return;
        }
    } catch (error) { console.log(error); }
});

module.exports = router;