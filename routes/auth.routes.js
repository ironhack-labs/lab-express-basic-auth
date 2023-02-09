const bcryptjs = require('bcryptjs');
const mongoose=require("mongoose");
const { Router } = require('express');
const User = require("../models/User.model")
const {isLoggedIn, isLoggedOut}= require("../middleware/route-guard")

const saltRounds = 10;
const router = new Router();

// GET route ==> to display the signup form to users
router.get('/signup',isLoggedOut, (req, res, next) => res.render('auth/signup'));

// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
    console.log('The form data: ', req.body);
    const { username, password } = req.body;

    ////////////////////////////////////////////////////////////////////
// make sure users fill all mandatory fields:
if (!username ===''|| !password==='') {
    res.render('auth/signup', { errorMessage: 'Please provide your username and password to login.' });
    return;
  }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            console.log(`Password hash: ${hashedPassword}`);
            return User.create({
                username,
                passwordHash: hashedPassword
            })
        })
        .then((newUser) => {
            console.log("nuevo usuario", newUser)
            const {username,_id}= newUser
            res.redirect("/userProfile")
        })
        .catch(error =>{
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/signup', { errorMessage: error.message });
               }   else if (error.code === 11000) {
                    res.status(500).render('auth/signup', {
                       errorMessage: 'Username need to be unique. Either username  is already used.'
                    });
            } else {
                next(error);
            }
        } );
});


router.get("/login",(req,res, next)=>{
    res.render("auth/login")
})


router.post('/login', (req, res, next) => { 
    const { username, password } = req.body;
    console.log('SESSION =====> ', req.session);
   
    if (username === '' ||password === '') {
      res.render('auth/login', {
        errorMessage: 'username and password to login.'
      });
      return;
    }
   
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Username is not registered. Try with other email.' });
          return;
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
            req.session.currentUser = user;
          //res.render('users/user-profile', {'users/user-profile', { userInSession: req.session.currentUser });
       res.redirect("/userProfile")
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });


router.get('/userProfile', isLoggedIn, (req, res) => res.render('users/user-profile', { userInSession: req.session.currentUser }));

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });

module.exports = router;