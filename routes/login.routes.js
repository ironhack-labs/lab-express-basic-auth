const { Router } = require("express");
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');

//userprofile
router.get('/userprofile',(req,res,next) => res.render('user/userprofile.hbs', { userInSession: req.session.currentUser }));

//signup
router.get('/signup',(req,res,next) => res.render('user/signup-form.hbs'));

router.post('/signup', (req, res, next) => {
    // console.log("The form data: ", req.body);
   const { username, password } = req.body;
   
   if (username === '' || password === '') {
    res.render('user/signup-form', {
      errorMessage: 'Please enter both, username and password to sign up.'
    });
    return;
  }
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          username,
          password: hashedPassword
        });
        })
      .then(userFromDB => {
        // console.log('Newly created user is: ', userFromDB);
        res.redirect('/login');
        })
      .catch(error => next(error));
  });

//login
router.get('/login',(req,res,next) => res.render('user/login.hbs'));

router.post('/login', (req, res, next) => {
   const { username, password } = req.body;
   
   if (username === '' || password === '') {
    res.render('user/login', {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }


   User.findOne({username})
    .then(user => {
        if (!user) {
            res.redirect('/signup', { errorMessage: 'User Name is not registered. Try with other user Name.' })
            return;
        }else if (bcryptjs.compare(password, user.password)) {
           console.log(user)
           req.session.currentUser = user
           res.redirect('/userprofile')
        }else {
            res.render('/login', { errorMessage: 'Incorrect password.' });
        }
    })
    .catch(error => next(error));
})

//delete

module.exports = router;

