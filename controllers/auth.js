const bcrypt = require("bcrypt")
const User = require("../models/User")

//============SIGNUP================

exports.signupView = (req, res) => res.render("auth/signup")

exports.signupProcess = async (req, res) => {
  const { username, password } = req.body
  if (username === "" || password === "") {
    return res.render("auth/signup", { error: "Missing fields" })
  }
  const existingUser = await User.findOne({ $or: [{ username }, { email }] })
  if (existingUser) {
    return res.render("auth/signup", { error: "Username or Email in use" })
  }
  const salt = bcrypt.genSaltSync(12)
  const hashPwd = bcrypt.hashSync(password, salt)
  await User.create({
    username,
    password: hashPwd
  })

  res.redirect("/auth/login")
}

//============LOGIN================

exports.loginView = (req, res) => {
  console.log(req.session)
  res.render("auth/login", { counter: req.session.counter })
}
exports.loginProcess = async (req, res) => {
  
  const { email, password } = req.body
  if (email === "" || password === "") {
    return res.render("auth/login", { error: "Missing fields" })
  }
  const existingUser = await User.findOne({ email })
  if (!existingUser) {
    return res.render("auth/login", { error: "Error" })
  }
  if (bcrypt.compareSync(password, existingUser.password)) {
    req.session.user = existingUser
    res.redirect("/profile")
  } else {
    return res.render("auth/login", { error: `Password doesn't match` })
  }
}