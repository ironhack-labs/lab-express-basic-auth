const bcrypt = require('bcrypt')
const User = require('../models/user')

// Get signup/login
exports.getSignup = (req, res) => {
  res.render('auth/signup', )
}

exports.getLogin = (req, res) => {
  res.render('auth/login', )
}

exports.postSignup = async (req, res) => {
  const {username, password} = req.body

  const salt = bcrypt.genSaltSync(10)
  const hashPassword = bcrypt.hashSync(password, salt)
  const users = await User.find({username})

  if (users.length !== 0) {
    return res.render('auth/signup', {
      errorMessage: 'User already exists'
    })
  }

  if (username === '' || password === '') {
    return res.render('auth/signup', {
      errorMessage: 'empty'
    })
  }

  await User.create({username, password: hashPassword})

  res.redirect('/')
}

exports.postLogin = async (req, res) => {
  const {username, password} = req.body
  //verificar si recibimos usuario y contraseña (si no están vacios)
  if (username === '' || password === '') {
    return res.render('auth/login', {
      errorMessage: 'empty'
    })
  }
  //verificamos si hay un usuario con ese username
  const user = await User.findOne({username})

  if (!user) {
    return res.render('auth/login', {
      errorMessage: 'no such user'
    })
  }
  //comparamos la contraseña
  if (bcrypt.compareSync(password, user.password)) {
    req.session.currentUser = user
    res.redirect('/')
  } else {
    res.render('auth/login', {
      errorMessage: 'invalid password'
    })
  }
}