const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { render } = require("../app");

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post("/signup", (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        res.render("auth/signup", {errorMessage:"Please fill all the fields"});
        return;
    }
    User.findOne({username}).then((userBack) => {
        if (userBack) {
            res.render("auth/signup", {errorMessage: "Username already taken"});
            return;
        }

        const hashingAlgorithm = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, hashingAlgorithm);

        User.create({
            username, 
            password: hashedPassword,
        }).then((newUser) => {
            res.redirect("/");
        });
    });
});

module.exports = router; 