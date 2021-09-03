const router = require('express').Router();
const User = require('../models/User.model.js');
const bcrypt = require('bcrypt');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const { username, pwd } = req.body;

  if (username.length === 0 || pwd.length === 0) {
    res.render('signup', { errorMessage: 'Username and password are vital' });
  }

  User.findOne({ username }).then(user => {
    if (user) {
      res.render('signup', { errorMessage: 'Username not available' });
      return;
    }

    const bcryptSalt = 10;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(pwd, salt);

    User.create({ username, password: hashPass })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err, 'Error!'));
  });
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const { username, pwd } = req.body;

  if (username.length === 0 || pwd.length === 0) {
    res.render('signup', { errorMessage: 'Username and password are vital' });
  }

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('signup', {
          errorMessage: 'No such user in our magic database',
        });
        return;
      }
      if (bcrypt.compareSync(pwd, user.password) === false) {
        res.render('signup', { errorMessage: 'Nice try little one!' });
        return;
      }
      req.session.currentUser = user;
      res.redirect('/');
    })
    .catch(err => console.log(err));
});

router.use((req, res, next) => {
  req.session.currentUser
    ? next()
    : res.render('login', { errorMessage: 'GET OUTTA HERE!' });
});

router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;
