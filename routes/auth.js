const User = require('../models/User.model');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const saltRounds = 5;
const mongoose = require('mongoose');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');


router.get('/signup', isLoggedOut, (req, res) => {
    data = {userInSession:req.session.currentUser}
    res.render('auth/signup', data)
})

router.post('/signup', (req, res, next) => {
    console.log('The form data: ', req.body);
    const {username, email, password} = req.body
if (!username ||!email || !password) {
    res.render('auth/signup', {errorMessage: 'Password, email and username required.'})
    return
}

const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
if(!regex.test(password)){
    res.render('auth/signup',{errorMessage: "Please input a password: at least 6 characters long, with a lowercase and uppercase letter"})
    return
}

    bcrypt 
        .genSalt(saltRounds)
        .then((salt) => {
            return bcrypt.hash(password, salt)
        })
        .then(hashedPassword => {
            console.log("Hashed password:", hashedPassword)
            return User.create({
                username: username, 
                email: email,
                passwordHash: hashedPassword
            })
        })
        .then(()=> {
            res.redirect('/profile')
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/signup', {errorMessage: error.message});
            } else if (error.code === 11000) {
                res.status(500).render('auth/signup', {
                    errorMessage: 'Username and email need to be unique and not already in use.'
                });
            } else {
                next(error);
            }
        });
})

router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

router.get('/profile', isLoggedIn,  (req, res) => { 
    console.log('What is in my session: ', req.session.currentUser)
    res.render('user/user-profile', {userInSession: req.session.currentUser}) // why is this different than the first object?
})

router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const { username , password } = req.body
   
    if (!username || !password ) {
      res.render('auth/login', {
        errorMessage: 'Please enter both, username and password to login.'
      })
      return
    }
   
    User.findOne({username})
      .then(user => {
          console.log(user)
        if (!user) {
          res.render('auth/login', { errorMessage: 'Username is not registered. Try with other username.' })
        } else if (bcrypt.compareSync(password, user.passwordHash)) {
            req.session.currentUser = user
            res.redirect('/profile')
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' })
        }
      })
      .catch(error => {
          console.log(error)
      })
  });

  router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });



module.exports = router