const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get('/signup', (req, res) => {
    res.render("auth/signup");
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;


    //checks if username and password are filled in
    if (!username || !password) {
        res.render('auth/signup', { errorMessage: "Fill username and password" });
        return;
    }

    //Checks for password strength
    const myRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!myRegex.test(password)) {
        res.render("auth/signup", {
            errorMessage: "Passsword is too weak",
        });
        return;
    }

    //checks if username already exists
    const user = await User.findOne({ username });
    if (user) {
        res.render("auth/signup", { errorMessage: "username already exists" });
        return;
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await User.create({
        username,
        password: hashedPassword,
    });

    res.redirect('/');
});

router.get("/login", async (req, res) => {
    res.render('auth/login')
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.render('auth/login', {
            errorMessage: "Fill username and password",
        });
        return;
    }

    const user = await User.findOne({ username });

    if (!user) {
        res.render('auth/login', {
            errorMessage: "Invalid login",
        });
        return;
    }

    //Check password
    if (bcrypt.compareSync(password, user.password)) {
        //Password match
        //Initializing the session with the current user
        req.session.currentUser = user;

        res.redirect('/');

    } else {
        //Password don't match
        res.render('auth/login', {
            errorMessage: "Invalid login",
        });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect("/");
});


module.exports = router;