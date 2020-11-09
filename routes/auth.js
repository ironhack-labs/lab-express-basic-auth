const { genSaltSync } = require("bcrypt")
const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/User")

router.get("/signup", (req, res) => {
    res.render("auth/signup")
})

router.post("/signup", async (req, res) => {
    const { username, password } = req.body
    if (username === "" || password === "") {
      return res.render("auth/signup", { error: "Missing fields" })
    } else {
      const user = await User.findOne({ username })
      
      if (user) {
        return res.render("auth/signup", { error: "Signup information not correct" })
      }
      const salt = bcrypt.genSaltSync(12)
      const hashpwd = bcrypt.hashSync(password, salt)
      
      await User.create({
        username,
        password: hashpwd
      })

      res.redirect("/profile")
    }
  })
  
  router.get("/login", (req, res) => {
    res.render("auth/login")
  })
  
  router.post("/login", async (req, res) => {
    
    const { username, password } = req.body
    if (username === "" || password === "") {
      res.render("auth/login", { error: "Some fields are not correct" })
    }
    const user = await User.findOne({ username })
    if (!user) {
      res.render("auth/login", { error: "Some fields are not correct" })
    }
    if (bcrypt.compareSync(password, user.password)) {
      delete user.password
      req.session.currentUser = user
      res.redirect("/profile")
    } else {
      res.render("auth/login", { error: "Some fields are not correct" })
    }
  })
  
  router.get("/profile", (req, res) => {
    res.render("auth/profile", { user: req.session.currentUser })
  })
  
  router.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/")
  })
  
  module.exports = router
  