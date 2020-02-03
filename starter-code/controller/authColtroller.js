require('dotenv').config()
const bcrypt = require('bcrypt')
const User = require('../models/User')



exports.signUpUser = (req, res) => {
  const {userName, password} = req.body
  if(!userName || !password ){
    let err = new Error
    console.log(err, "Se chingo el signup")
    res.redirect("/login")
  } else{
        res.render({userName, password})
      const salt = await bcrypt.genSalt(Number(process.env.SALT))
      const hashed = await bcrypt.hash(password, salt)
      const user = await User.create({username, password: hashed})
  }
}

exports.loginUser = await = (req, res) => {
    const {userName, password} = req.body
    const user = await User.findOne({userName})
    if (!user) {
      res.render("/login")
    } else {
      const correct = await bcrypt.compare(password, user.password)
        if (correct) {
            req.session.loggedUser = user
            req.app.locals.loggedUser = user
            res.redirect('/profile')
        } else {
            res.render('login')
        }
    }
    }


exports.loginPage=(req, res) => {
 res.render("login")
}
exports.signUpPage=(req, res) => {
  res.render("signUp")
}
exports.profilePage=(req, res) =>{
  res.render("profile")
}
exports.privatePage=(req, res) =>{
  res.render("private")
}
exports.logout= async(req, res) =>{
  await req.session.destroy()
    res.redirect('/login')
}
