const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

module.exports = {
  signinGET(req, res) {
    return res.render('signin');
  },

  async signinPOST(req, res) {
    const { username, password } = req.body;
    if (!username || !password) return res.render('signin', { error: 'Por favor, ingrese todos los campos.' });

    const user = await User.findOne({ username });
    if (user) return res.render('signin', { error: 'Por favor, inténtelo nuevamente.' });

    const salt = bcrypt.genSaltSync(12);
    const hashPwd = bcrypt.hashSync(password, salt);

    User
      .create({ username, password: hashPwd })
      .then(() => res.render('signin', { message: 'Usuario creado satisfactoriamente.' }))
      .catch(() => res.render('signin', { error: 'Por favor, intentelo nuevamente.' }));
  },

  loginGET(req, res) {
    if (req.session.currentUser) return res.redirect('/profile');
    return res.render('login');
  },

  async loginPOST(req, res) {

    const { username, password } = req.body;
    if (!username || !password) return res.render('login', { error: 'Por favor, ingrese todos los campos.' })

    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.render('login', { error: 'Por favor, intentelo de nuevo.' });
    }
    delete user.password;
    req.session.currentUser = user;
    return res.redirect('/profile');
  },
  profileGET(req, res) {
    if (!req.session.currentUser) return res.redirect('/login');
    return res.render('profile/index', { user: req.session.currentUser, tittle: req.session.currentUser, layout: 'profile/layout' });
  },

  mainGET(req, res) {
    if (!req.session.currentUser) return res.redirect('/login');
    return res.render('main', { user: req.session.currentUser, tittle: req.session.currentUser, layout: 'profile/layout' });
  },
  privateGET(req, res) {
    if (!req.session.currentUser) return res.redirect('/login');
    return res.render('private', { user: req.session.currentUser, tittle: req.session.currentUser, layout: 'profile/layout' });
  }

};
