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


router.get("/login", (req, res, next) => {
    res.render("login");
});

router.post("/login", (req, res, next) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;
    if (theUsername === "" || thePassword === "") {
        res.render("login_err");
        return;
    }

    User.findOne({ "username": theUsername })
        .then(user => {
            if (!user) {
                res.render("login_err");
                return;
            }
            if (bcrypt.compareSync(thePassword, user.password)) {
                console.log(req.session);
                req.session.currentUser = user;
                res.redirect("/private");
            } else {
                res.render("login_err");
            }
        })
        .catch(error => {
            next(error);
        })
});



router.use((req, res, next) => {
    if (req.session.currentUser) {
        next(); 
        }else {
        res.redirect("/login");
        }
    });
router.get("/main", (req, res, next) => {
    res.render("main");
});                             
router.get("/private", (req, res, next) => {
    res.render("private");
});


module.exports = router;