const express = require("express");
const router = express.Router();

const User = require("../models/user");

const bcrypt = require("bcryptjs");
const bcryptSalt = 4;

router.get("/signup", (req, res, next) => {
    res.render("signup");
});


router.post("/signup", (req, res, next) => {
    //console.log("post: /signup");
    const username = req.body.username;
    const password = req.body.password;

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({
    username,
    password: hashPass
    })
    .then(() => {
        res.redirect("/");
    })
    .catch((error) => {
       console.log(error);
       res.render("signup_err");
    })
});




module.exports = router;