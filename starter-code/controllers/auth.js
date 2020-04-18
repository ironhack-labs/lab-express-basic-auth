const bcrypt = require('bcrypt')
const User = require('../models/User')



exports.mainView = (req, res) => {
  res.render("auth/main");
};

exports.signupView = (req, res) => {
  res.render('auth/signup')
}

exports.signupProcess = async (req, res) => {
  const { username, password } = req.body
  if (username === '' || password === '') {
    return res.render('auth/signup', {
      error: 'Missin info, try again..',
    })
    
  }
  const userInDB = await User.findOne({ username })

  if (userInDB !== null) {
    return res.render('auth/signup', {
      error: 'Username already taken, would you like to log in instead?',
    })
    
  }
 
  const salt = bcrypt.genSaltSync(12)
  const hashPass = bcrypt.hashSync(password, salt)

  await User.create({
    username,
    password: hashPass,
  })
  res.redirect('/login')
}

exports.loginView = (req, res) => {
  res.render('auth/login')
}

exports.loginProcess = async (req, res) => {
  const { username, password } = req.body
  if (username === '' || password === '') {
    return res.render('auth/login', { error: 'Please provide your log in credentials!' })
  }

  const userInDB = await User.findOne({ username })
  if (userInDB === null) {
    return res.render('auth/login', { error: 'This user does not exist! </3' })
  }

  if (bcrypt.compareSync(password, userInDB.password)) {
    req.session.currentUser = userInDB
    res.redirect('private')
  } else {
    res.render('auth/login', { error: 'Incorrect password try again' })
  }
}


exports.logoutProcess = async (req, res) => {
  await req.session.destroy()
  res.redirect('/')
}

exports.privateView = (req, res) => {
  res.render('private', req.session.currentUser)
}
