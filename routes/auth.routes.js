const mongoose = require('mongoose');
const {Router} = require ('express')
const router = new Router()
const bcryptjs = require('bcryptjs')
const saltRounds =10
const User = require ('../models/User.model')

// GET route ==> to display the signup form to users
router.get ('/signup', (req,res) => res.render('signup.hbs'))

// POST route ==> to process form data
router.post('/signup', (req, res, next) => { 
const {username, password} =req.body;

// make sure users fill all mandatory fields:
if (!username || !password) {
    res.render('signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then (hashedPassword => {
  console.log(`Password hash: ${hashedPassword}`)
  return User.create ({
      username,
      password: hashedPassword
  })
})
.then(userFromDB =>{
    console.log('Newly created user is: ', userFromDB);
    res.redirect('/userProfile');  
}) 
.catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('signup', { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render('signup', {
         errorMessage: 'Username needs to be unique. Username is already used.'
      });
    } else {
      next(error);
    }
  })
})

//////////// L O G I N ///////////

// GET route ==> to display the login form to users
router.get('/login', (req, res) => res.render('login'));

// POST login route ==> to process form data
router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const {username, password} = req.body;
    if (username === '' || password === '') {
        res.render('login', {
          errorMessage: 'Please enter both, username and password to login.'
        });
        return;
    }
    User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('login', { errorMessage: 'Username is not registered. Try with other username.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //res.render('users/user-profile', { user });
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
})

router.get ('/userProfile', (req, res) => {
    res.render('users/user-profile', {userInSession:req.session.currentUser})
})

router.post('/logout', (req, res) => {
    req.session.destroy();
      res.redirect('/');
    });

module.exports = router