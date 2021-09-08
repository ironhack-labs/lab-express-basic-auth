const router = require("express").Router();
const User = require('../models/User.model');

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 4) {
    res.render('signup', { message: 'Your password needs to be 4 chars min' });
    return;
  }
  if (username.length === 0) {
    res.render('signup', { message: 'Username cannot be empty' });
    return;
  }

  User.findOne({ username: username })
    .then(userFromDB => {
      if (userFromDB !== null) {
        res.render('signup', { message: 'Username is already taken' });
      } else {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        User.create({ username: username, password: hash })
          .then(createdUser => {
            res.redirect('/');
          })
          .catch(err => {
            next(err);
          })
      }
    })
});

module.exports = router;