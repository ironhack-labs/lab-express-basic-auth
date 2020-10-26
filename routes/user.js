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
        const user = await User.findOne({ username: username });
        
        if (user !== null) {
          res.render("users/signup", {
            errorMessage: "The username already exists!",
          });
          return;
        }
        await User.create({
            username,
            password: hashPass,
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
        const user = await User.findOne({username: username});
        console.log(user);
        if (!user){
            res.render("users/login", {
                errorMessage: "The username doesn't exist",
            });
            return;
        }

        if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser =  user;
            res.redirect("/");
        } else{
            res.render("users/login", {
                errorMessage: "Incorrect password",
            });
        }
    } catch(error){}
});



module.exports = router;