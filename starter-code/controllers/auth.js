const bcrypt = require('bcrypt')
const User = require('../models/User')

exports.vistaSignup = (req, res) => {
  res.render('auth/signup')
}

exports.procesoSignup = async (req, res) => {
  const { username, password } = req.body

  if (username === '' || password === '') {
    return res.render('auth/signup', { error: 'Error' })
  }

  const userinDB = await User.findOne({ username })

  if (userinDB !== null) {
    return res.render('auth/signup', { error: 'Existe' })
  }

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)

  await User.create({ username, password: hash })
  res.redirect('/')
}
