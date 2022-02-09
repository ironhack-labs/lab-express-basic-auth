const router = require("express").Router();
const { exists } = require("../models/User.model");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const mongoose = require('mongoose');
const { isLoggedIn, isLoggedOut } = require("./../middleware/route-guard");

router.get("/signup", isLoggedOut, (req, res, next)=> {
    res.render("auth/signup.hbs");
});

router.post("/signup", isLoggedOut, async (req, res, next)=> {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.render("auth/signup", {message: "Completion of all fields required"});
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        let dbUser = await User.findOne({ email });
        if (!dbUser) {
            const newDbUser = await User.create({username, email, passwordHash: passwordHash});
            req.session.currentUser = newDbUser;
            res.redirect("/profile");
        } else {
            res.render("auth/signup", {message: "Username or email already exist. Try again or login if you have already signed up."}); 
        }
    } catch(error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { message: error.message });
        } else {
            next(error);
        }
    }
});

router.get("/profile", isLoggedIn, (req, res)=> {
    res.render("profile.hbs", {user : req.session.currentUser});
});

router.get("/login", isLoggedOut, (req, res, next)=> {
    res.render("auth/login", {user: req.session.currentUser});
});

router.post("/login", isLoggedOut, async (req, res, next)=> {
    try {
        const { username, email, password } = req.body;
        if (!email || !password) {
            res.render("auth/login", {message: "Completion of all fields required"});
            return;
        }
        let dbUser = await User.findOne({ email });
        if (!dbUser) {
            const newDbUser = await User.create({username, email, passwordHash: passwordHash});
            res.render("auth/login", {message: "User unknown. Please check your details or sign up."});
        } else if (await bcrypt.compare(password, dbUser.passwordHash)) {
            req.session.currentUser = dbUser;
            res.redirect("/profile");
        } else {
                res.render("auth/login", {message: "Password incorrect, please try again or sign up if you have not registered"});
        }
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/login', { message: error.message});
        } else {
            next(error);
        }
    }
});

router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });


module.exports = router;