const User = require('../models/User')
const bcrypt = require('bcrypt')

exports.mostrarSignup = (req, res, next) => {
  res.render('auth/signup')
}

exports.hacerSignup = async (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(7);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const user = await User.create({ username, password: hashedPassword });
  res.redirect('/login');
}

exports.mostrarLogin = (req, res, next) => {
  res.render('auth/login')
}

exports.hacerLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    res.render('auth/login', { err: "User doesn't exist" });
  }
  if (bcrypt.compareSync(password, user.password)) {
    req.session.loggedUser = user;
    req.app.locals.loggedUser = user;
    res.redirect('/profile');
  } else {
    res.render('auth/login', { err: 'errorrrrr' });
  }
}

exports.access = (req, res, next) => {
  const { loggedUser } = req.app.locals;
  if(loggedUser){
    res.render('auth/profile', loggedUser);
  }
  res.render('auth/login', { err: 'errorrrrr' });
}

exports.accessMain = (req, res, next) => {
  const { loggedUser } = req.app.locals;
  if(loggedUser){
    res.render('auth/profile', loggedUser);
  }
  res.render('auth/main', { err: 'errorrrrr' });
}

exports.accessPrivate = (req, res, next) => {
  const { loggedUser } = req.app.locals;
  if(loggedUser){
    res.render('auth/profile', loggedUser);
  }
  res.render('auth/private', { err: 'errorrrrr' });
}