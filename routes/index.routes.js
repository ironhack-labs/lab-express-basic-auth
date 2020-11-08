const express = require('express');
const router = express.Router();

const { genSaltSync } = require("bcrypt")
const bcrypt = require("bcrypt")
const User = require("../models/User.model")

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/logIn', (req, res) => {
    res.render('auth/login')
})

router.post("/logIn", async(req, res) => {
    const { email, password } = req.body
    if (email === "" || password === "") {
        res.render("auth/login", { error: "Missing fields" })
    }
    const user = await User.findOne({ email })
    if (!user) {
        res.render("auth/login", { error: "something went wrong" })
    }

    if (bcrypt.compareSync(password, user.password)) {
        delete user.password
        req.session.currentUser = user
        res.redirect("/profile")
    } else {
        res.render("auth/login", { error: "something went wrong" })
    }
})


router.get('/signUp', (req, res) => {
    res.render('auth/signup')
})

router.post("/signUp", async(req, res) => {
    const { username, email, password } = req.body
    if (username === "" || email === "" || password === "") {
        return res.render("auth/signup", { error: "Missing fields" })
    } else {
        const user = await User.findOne({ email })
        if (user) {
            return res.render("auth/signup", { error: "something went wrong" })
        }
        const salt = bcrypt.genSaltSync(12)
        const hashpwd = bcrypt.hashSync(password, salt)
        await User.create({
            username,
            email,
            password: hashpwd
        })
        res.redirect("/profile")
    }
})

router.get("/profile", (req, res) => {
    res.render("auth/profile", { user: req.session.currentUser })
})

router.get("/main", (req, res) => {
    res.render("main")
})

router.get("/private", (req, res) => {
    res.render("private", { user: req.session.currentUser })
})

module.exports = router;