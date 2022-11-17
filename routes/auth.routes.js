const { Router } = require('express');
const User = require('../models/User.model');
const router = new Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');

//                            | = only visilble when user is loggt out                         
router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    // console.log('The form data: ', req.body);

    const { username, password } = req.body;
 
    bcrypt
      .genSalt(saltRounds)
      .then(salt => bcrypt.hash(password, salt))
      .then(hashedPassword => {
        // console.log(`Password hash: ${hashedPassword}`);
        return User.create({
            // username: username
            username,
            // passwordHash => this is the key from the User model
            //     ^
            //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
            password: hashedPassword
          });
      })
      .then(userFromDB => {
        // console.log('Newly created user is: ', userFromDB);
        res.redirect('/userProfile');
      })
      .catch(error => next(error));
  });

  
  router.get('/login', (req, res) => res.render('auth/login'));
  
  router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
      const { username, password } = req.body;
      
      if (username === '' || password === '') {
          res.render('auth/login', {
              errorMessage: 'Please enter both, email and password to login.'
            });
            return;
        }
        
        User.findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Name is not registered. Try again' });
                return;
            } else if (bcrypt.compareSync(password, user.password)) {
                // res.redirect('/userProfile')
                //   res.render('user/user-profile', { user });
                  req.session.user = user;
                  res.redirect('/userProfile');
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.' });
            }
        })
        .catch(error => next(error));
    });


//                            |= only working when user is logged in 
router.get('/userProfile',isLoggedIn, (req, res) => {
    res.render('user/user-profile', { user: req.session.user });
  });
  
    
    router.get('/userProfile', (req, res) => res.render('user/user-profile'));

    router.post('/logout', (req, res, next) => {
        req.session.destroy(err => {
          if (err) next(err);
          res.redirect('/');
        });
      });

      

    module.exports = router;