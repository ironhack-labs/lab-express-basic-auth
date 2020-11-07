const express = require('express')
const router = express.Router()
const User = require('../models/User.model')
const bcrypt = require('bcrypt')





router.get("/signup", (req,res) => {
    res.render("auth/signup")
})

router.post('/signup', async (req, res)=>{
    const {email, password} = req.body
    if(email==="" || password==="") {
        console.log(email)
        return res.render("auth/signup", {error: "There are missing fields 🙁"})
    }
    else {
        const userEmail = await User.findOne({email})
        if (userEmail) {
            return res.render("auth/signup", {error: "Whops! Something went wrong 🤔"})
        }

        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt)

        await User.create({email, password: hashPassword})

        res.redirect('/profile')
    } 
})

router.get("/login", (req, res) => {
    res.render("auth/login")
})
router.post('/login', async (req, res) => {
    const {email, password} = req.body

    if (email === '' || password === '') {
        res.render("auth/login", {
            error: "Missing fields! Make sure you fill evey field to login."
        })
    }

    const user = await User.findOne({email})

    if (!user) {
        res.render('auth/login', {error: "something went wrong boy!"})
    }
    if (bcrypt.compareSync(password, user.password)) {
        delete user.password
        req.session.currentUser = user
        res.redirect("/profile")
    } else {
        res.render("auth/login", {
            error: "something went wrong"
        })
    }


})
router.get("/profile", (req,res)=>{
    if (req.session.currentUser) {
        res.render("auth/profile", {
            user: req.session.currentUser
        })
    } else {
        res.render("index")
    }
})

router.get('/main', (req, res) => {
    if (req.session.currentUser) {
        res.render("auth/main")
    } else {
        res.render("index")
    }
})



router.get('/private', (req, res) => {
     if (req.session.currentUser) {
         res.render('auth/private')

     } else {
         res.render("index")
     }
})

router.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})
module.exports = router


