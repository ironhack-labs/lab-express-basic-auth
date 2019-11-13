const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();
const loginCheck = require("../loginCheck")

router.get("/signup", (req, res) => {
    res.render("signup.hbs");
});

router.get("/login", (req, res) => {
    res.render("login.hbs");
})

router.post("/login", (req, res) => {
    const {username, password} = req.body;
    User.findOne({username: username})
    .then(found => {
        if(!found) {
            res.render("login.hbs", {message: "Wrong credentials!"} );
            return;
        }
        return bcrypt.compare(password, found.password)
        .then(bool => {
            if(bool === false) {
                res.render("login.hbs", {message: "Wrong credentials"});
                return; 
            }
            req.session.user = found;
            res.redirect("/");
        })
    })
    .catch(err => {
        console.log(err);
    })
})

router.post("/signup", (req, res) => {
    const {
        username,
        password
    } = req.body;
    if (!username) {
        res.render("signup.hbs", {
            message: "Username needs to be defined!"
        });
    }
    if (password < 8) {
        res.render("signup.hbs", {
            message: "Password is too short!"
        });
    }
    // res.send("test")
    User.findOne({
            username: username
        }).then(found => {
            if (found) {
                res.render("signup.hbs", {
                    message: "Username is already taken!"
                });
                return;
            }
            bcrypt.genSalt()
                .then(salt => {
                    console.log("salt: ", salt);
                    return bcrypt.hash(password, salt);
                })
                .then(hash => {
                    console.log("hash: ", hash);
                    return User.create({
                        username: username,
                        password: hash
                    });
                })
                .then(newUser => {
                    console.log(newUser);
                    req.session.user = newUser;
                    res.redirect("/");
                })
        })
        .catch(err => {
            console.log(err);
        })
});

router.get("/main", loginCheck(), (req, res) => {
    res.render("main.hbs", {user: req.session.user});
})


router.get("/private", loginCheck(), (req, res) => {
    res.render("private.hbs", {user: req.session.user});
})

router.get("/logout", (req, res, next) => {
    req.session.destroy(err =>{
        if(err) next(err);
res.redirect("/");
})
});

module.exports = router;