const express = require('express');
const router = express.Router();
const { genSaltSync } = require("bcrypt") //para que es esto?
const bcrypt = require("bcrypt")
const User = require("../models/User.model")

/* GET home page */
router.get('/', (req, res, next) => {
    if (req.session.count) {
        req.session.count+=1
    } else {
        req.session.count = 1
    }
    res.render('index')
})

//ITERACION 1: Signup
router.get("/signup", async (req, res) => {
    res.render("signup")
})

router.post("/signup", async (req,res) => {
    //1. Take info from form
    const {username, password} = req.body
    //2. evaluate if incomplete form
    if (username === "" || password === "") {
        return res.render("signup", {error: "Missing fields"})
    } else {
        //3. Check if user exists
        const user = await User.findOne({username})
        //3.1 If user exists, give error
        if(user) {
            return res.render("signup", {error: "Username already exists. Login instead"})
        }
        //4 ENCRYPT THE PASSWORD
        const salt = bcrypt.genSaltSync(10)
        const hashpwd = bcrypt.hashSync(password, salt)
        //4.1
        await User.create({
            username,
            password: hashpwd
        })
        res.redirect("/private")
    }

})

router.get("/private", async (req, res) => {
    res.render("private")
})

//ITERACION 2: Login
router.get("/login", (req, res) => {
    res.render("login")
  })

router.post("/login", async (req, res) => {
    //1. Get form info
    const {username, password} = req.body
    //2. Evaluate if info is complete
    if (username === "" || password === "") {
        res.render("login", {error: "Missing fields"})
    }
    //3. Check if username exists
    const user = await User.findOne({username})
    if (!user){
        res.render("login", {error: "Email or Password incorrect."})
    }
    //4. If user exists, compare password
    if (bcrypt.compareSync(password, user.password)) {
        //4.1 if passwords match, render profile 
        delete user.password
        //PARA QUE ES ESTO??
        req.session.currentUser = user
        res.redirect("/private")
    } else {
        req.render("login", {error: "Something went wrong"})
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})

module.exports = router;
