const { genSaltSync } = require("bcrypt")
const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/User")

router.get("/signup", (req, res) => {
  res.render("auth/signup")
})

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body
  if (username === "" || email === "" || password === "") {
    return res.render("auth/signup", { error: "Missing fields" })
  } else {
    const user = await User.findOne({ email })
    if (user) {
      return res.render("auth/signup", { error: "Ups...Something went wrong" })
    }
    const salt = bcrypt.genSaltSync(10)
    const hashpwd = bcrypt.hashSync(password, salt)
    await User.create({
      username,
      email,
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
    res.render("auth/login", { error: "Missing fields" })
  }
  const user = await User.findOne({ username })
  if (!user) {
    res.render("auth/login", { error: "Ups..Something went wrong" })
  }

  if (bcrypt.compareSync(password, user.password)) {
    delete user.password
    req.session.currentUser = user
    res.redirect("/profile")
  } else {
    res.render("auth/login", { error: "Upsss..something went wrong" })
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