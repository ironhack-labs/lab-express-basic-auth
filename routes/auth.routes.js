const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRound = 7;

// GET /auth/signup
router
  .route('/signup')
  .get((req, res) => {
    res.render('signup');
  })
  .post((req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      res.render('signup', { message: 'All fields are required!' });

    User.findOne({ username })
      .then(user => {
        if (user)
          res.render('signup', { message: 'This user already exists!' });

        // we create some "salt" to add in the password
        const salt = bcrypt.genSaltSync(saltRound);
        // we encrypt the password, adding that salt
        const hashedPwd = bcrypt.hashSync(password, salt);
        ////////
        User.create({ username, password: hashedPwd })
          .then(user =>
            res.render('index', { message: 'User created!!', user: user })
          )
          .catch(err =>
            res.render('signup', {
              message: `Oh, no! There's been an error... ${err}`,
            })
          );
      })
      .catch(err =>
        res.render('signup', {
          message: `Oh, no! There's been an error...${err}`,
        })
      );
  });

router
  .route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post((req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      res.render('login', { message: 'All fields are required!' });

    User.findOne({ username })
      .then(user => {
        if (!user) res.render('login', { message: 'User does not exist' });

        // user.password is the encrypted one (based in the DB)
        const isPwdCorrect = bcrypt.compareSync(password, user.password);

        if (isPwdCorrect) {
          req.session.loggedInUser = user;
          res.render('userProfile', {
            user: user,
            message: 'You are logged in!',
          });
        } else res.render('login', { message: 'You could not log in!' });
      })
      .catch(err =>
        res.render('login', {
          message: `Oh, no! There's been an error...${err}`,
        })
      );
  });

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) res.redirect('/');
    else res.render('login', { message: 'You are logged out!' });
  });
});

module.exports = router;
