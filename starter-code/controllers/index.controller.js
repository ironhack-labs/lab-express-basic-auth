require('dotenv').config()
const bcrypt = require('bcrypt')
const User = require('../models/User')

exports.indexView = (req, res, next) => res.render('index')

exports.signupView = (req, res, next) => {
  const config = {
    action: 'signup',
    register: true
  }
  res.render('form', config)
}

exports.loginView = (req, res, next) => {
  const config = {
    action: 'login',
    register: false
  }
  res.render('form', config)
}

exports.signupPost = async (req, res, next) => {
  const { username, password} = req.body
  const config = {
    action: 'signup',
    register: true
  }
    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashPassword = await bcrypt.hash(password, salt)
    const user = await User.create({ username,password: hashPassword })
    res.redirect('/login')
}

exports.loginPost = async (req, res, next) => {
  const { username, password } = req.body
  const config = {
    action: 'login',
    register: false
  }
  const user = await User.findOne({ username })
  if (!user) {
    config.err = 'El usuario o contraseña que tecleaste son incorrectos'
    res.render('form', config)
  } else {
    const trusted = await bcrypt.compare(password, user.password)
    if (trusted) {
      req.session.loggedUser = user
      req.app.locals.loggedUser = user
      res.redirect('/profile')
    } else {
      config.err = 'El usuario o contraseña que tecleaste son incorrectos'
      res.render('form', config)
    }
  }
}

exports.profileView = (req, res, next) => res.render('profile')

exports.logout = async (req, res, next) => {
  await req.session.destroy()
  res.redirect('/login')
}