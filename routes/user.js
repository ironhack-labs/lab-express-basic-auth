const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/signup", (req, res, next) => {
    res.render("users/signup");
});

router.post("/signup", async (req, res, next) => {
    const {username, password} = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    try {
        const user = await User.findOne({ userName: username });

        if (user !== null) {
          res.render("users/signup", {
            errorMessage: "The username already exists!",
          });
          return;
        }
        await User.create({
            userName : username,
            passwordHash: hashPass,
        });
        res.redirect("/");
    } catch(error) {
        next(error);
    }
});

router.get("/login", (req, res, next) => {
    res.render("users/login");
});



router.post("/login", async (req, res, next) => {
    if (req.body.email === "" || req.body.password === "") {
        res.render("users/login", {
          errorMessage: "Indicate a username and a password to login",
        });
        return;
      }
    const {username, password} = req.body;

    try{
        const user = await User.findOne({userName: username});
        console.log(user);
        if (!user){
            res.render("users/login", {
                errorMessage: "The username doesn't exist",
            });
            return;
        }

        if (bcrypt.compareSync(password, user.passwordHash)) {
            req.session.currentUser =  user;
            res.redirect("/userProfile");
        } else{
            res.render("users/login", {
                errorMessage: "Incorrect password",
            });
        }
    } catch(error){
        console.log(error);
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });

module.exports = router; 