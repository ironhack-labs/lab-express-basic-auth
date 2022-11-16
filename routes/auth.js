const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

// Signin
router.get('/auth/signup', (req, res, next) => {
    res.render('signup');
});

router.post('/auth/signup', (req, res, next) => {
    const { username, password } = req.body;

    //validation 
    if (password.length < 4) {
        console.log("password less than 4 characters");
        res.render('signup', { nmessage: "Password should be at least 4 characters" })
        return
    }

    User.findOne({ username }) // find if the username is taken
      .then(userFromDB => {
          if (userFromDB !== null) {
            console.log("username already taken");
            res.render('signup', { message: "Username is already taken" })
          } else { //if not, hash the password
            console.log(`Created user ${username} in the DB`);
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);
            User.create({ username, password: hash })
              .then(createdUser => {
                  res.redirect('/auth/login');
              })
              .catch(err => next(err));
          }
      })
})

// Log in
router.get('/auth/login', (req, res, next) => {
    res.render('login');
});

router.post('/auth/login', (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ username })
      .then(userFromDB => {
          if (userFromDB === null) {
              console.log('Login: User not found')
              res.render('login', { message: 'Wrong Credentials' });
              return
          }

          if (bcrypt.compareSync(password, userFromDB.password)) {
              console.log('Login: logged in, password correct, created session');
              req.session.user = userFromDB;
              res.redirect('/profile');
          } else {
              console.log('Login: password not correct');
              res.render('login', { message: 'Wrong Credentials' });
              return
          }
      })
      .catch(err => next(err));
})

router.get("/auth/logout", (req, res, next) => {
    // Logout user
    req.session.destroy()
    res.redirect("/")
})

module.exports = router;
