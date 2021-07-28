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

module.exports = router;