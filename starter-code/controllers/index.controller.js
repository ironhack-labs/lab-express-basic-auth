const bcrypt = require('bcrypt');
const User = require('./../models/User');

exports.isLoggedin = (req, res, next) => {
  if (req.session.loggedUser) {
    next();
  } else {
    res.redirect('/login');
  }
};

exports.getLoginForm = (req, res, next) => {
  if (req.session.loggedUser) {
    return res.redirect('/main');
  }
  res.render('auth/login');
};

exports.getSignupForm = (req, res, next) => {
  if (req.session.loggedUser) {
    return res.redirect('/main');
  }
  res.render('index');
};

exports.createUser = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render('index', { err: 'You must provide an username and password' });
  }
  const salt = bcrypt.genSaltSync(7);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    await User.create({ username, password: hashedPassword });
    res.redirect('/');
  } catch (e) {
    res.render('index', {
      err: 'This username is already in use'
    });
    console.log(e);
  }
};

exports.findUser = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.render('auth/login', { err: 'Username or password incorrect' });
  }
  if (bcrypt.compareSync(password, user.password)) {
    req.session.loggedUser = user;
    req.app.localsr = user;
    return res.redirect('/private');
  }
  return res.render('auth/login', { err: 'Username or password incorrect' });
};

exports.getPrivate = (req, res, next) => {
  res.render('private');
};

exports.getMain = (req, res, next) => {
  res.render('main');
};
