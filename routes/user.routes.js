const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model')

// .get() route ==> to display the signup form to users

router.get('/signup', (req, res) => res.render('auth/signup'));

// .post() route ==> to process form data

router.post('/signup', (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return;
      }


    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
        username,
        email,
        passwordHash: hashedPassword
        });
    })
    .then(userFromDB => {
        console.log('New user is: ', userFromDB);
        res.redirect('/main');
    })
    .catch(error => next(error));
});


//login
router.get('/login', (req, res) => res.render('auth/login'));


router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.render('auth/login', {
          errorMessage: 'Please enter both, email and password to login.'
        });
        return;
      }
      User.findOne({ email })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
          return;
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
          req.session.currentUser = user;
            res.redirect ('/main');
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });

  
  router.get('/userProfile', (req, res) => {
      console.log(req.session.currentUser)
    res.render('users/user-profile', { userInSession: req.session.currentUser });
  });
//logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });
  
  const privatePages = (req,res,next) => {
    const verifySesion = req.session.currentUser
    if(!verifySesion){
      res.redirect('/login');
    }
    else{
      next()
    }
  }
  router.get('/main', privatePages, (req,res) =>{
    res.render('users/main', { userInSession: req.session.currentUser})
  })
  router.get('/private', privatePages, (req,res) =>{
    res.render('users/private')
  })

module.exports = router;


