const bcrypt = require("bcrypt")
const User = require("../models/User.model")

//============SIGNUP================

exports.signupView = (req, res) => res.render("auth/signup")

exports.signupProcess = async (req, res) => {
  const { username, email, password } = req.body

  if (username === "" || password === "") {
    return res.render("auth/signup", { error: "Missing fields" })
  }

  const existingUser = await User.findOne({ username } )

  if (existingUser) {
    return res.render("auth/signup", { error: "Username in use" })
  }

  const salt = bcrypt.genSaltSync(12)
  const hashPwd = bcrypt.hashSync(password, salt)

  await User.create({
    username,
    password: hashPwd
  })

  res.redirect("/")
}

//============LOGIN================

exports.loginView = (req, res) => {
  res.render("auth/login")
}

exports.loginProcess = async (req, res) => {

  const { username, password } = req.body
  if (username === "" || password === "") {
    return res.render("auth/login", { error: "Missing fields" })
  }

  const existingUser = await User.findOne({ username })
  if (!existingUser) {
    return res.render("auth/login", { error: "Error" })
  }

  if (bcrypt.compareSync(password, existingUser.password)) {

    req.session.user = existingUser
    res.redirect("/")
  } 
  else {
    return res.render("auth/login", { error: `Password doesn't match` })
  }
}
