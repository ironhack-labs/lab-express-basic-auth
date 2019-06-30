const bcrypt = require('bcrypt')
const User = require('../models/User')

exports.getSignUp = (req, res) => {
  res.render('auth/signup')
}
exports.postSignUp = async (req, res) => {
  const { firstName, lastName, username, password } = req.body
  const salt = bcrypt.genSaltSync(10)
  const hashPassword = bcrypt.hashSync(password, salt)

  const users = await User.find({ username })

  //inputed a user name
  if (users.length !== 0) {
    return res.render('auth/signup', { errorMessage: 'pick a new username' })
  }

  //do we have user && password
  if (username === '' || password === '') {
    return res.render('auth/signup', { errorMessage: 'Need to put something' })
  }
  //create user
  await User.create({ firstName, lastName, username, password: hashPassword })

  res.redirect('/')
}
exports.getLogin = (req, res) => {
  res.render('auth/login')
}

exports.postLogin = async (req, res) => {
  const { username, password } = req.body
  //check foruser name and password input)
  if (username === '' || password === '') {
    return res.render('auth/login', {
      errorMessage: 'empty'
    })
  }
  //serch for user name
  const user = await User.findOne({ username })

  if (!user) {
    return res.render('auth/login', {
      errorMessage: 'no such user'
    })
  }
  //check password
  if (bcrypt.compareSync(password, user.password)) {
    req.session.currentUser = user
    res.redirect('/')
  } else {
    res.render('auth/login', {
      errorMessage: 'invalid password'
    })
  }
}
