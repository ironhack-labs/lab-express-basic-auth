const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');


/* GET home page */
router.get("/", (req, res, next) => {
    res.render("index");
});


//route for signup
router.get("/singup", (req, res, next) => {
    res.render("singup");
});

//route for login
router.get("/login", (req, res, next) => {
    res.render("login");
});




//router post to create a new user
router.post("/singup", (req, res, next) => {
    const { username, password } = req.body;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPass = bcrypt.hashSync(password, salt);


    User.create({ username, password: hashPass })
        .then((user) => {
            res.redirect("/");
        })
        .catch((err) => {
            res.render("singup", { message: "Something went wrong" });
        });
});






module.exports = router;