require('dotenv').config()
const bcrypt = require('bcrypt')
const User = require('../models/User')


exports.signUpView = (req, res) => {
    const config = {
        action: 'Sign Up',
        register: true
    }
    res.render('forms', config)
}


exports.signUp = async (req, res) => {
  const { email, name, password, password_verify } = req.body
  const config = {
    action: 'signup',
    register: true
  }
  if (password !== password_verify) {
    config.err = 'Los passwords deben de ser iguales'
    res.render('form', config)
  } else {
    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashPassword = await bcrypt.hash(password, salt)
    const user = await User.create({ email, name, password: hashPassword })
    res.redirect('/login')
  }
}

exports.loginView = (req, res) => {
    const config = {
        action: 'Log In',
        register: false
      }
    res.render('forms', config)
}


exports.login = async (req, res, next) => {
    const { email, password } = req.body
    const config = {
      action: 'login',
      register: false
    }
    const user = await User.findOne({ email })
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