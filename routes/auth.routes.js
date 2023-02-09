const bcryptjs = require('bcryptjs')
const { Router } = require('express')
const app = require('../app')
const User = require("../models/User.model")
 const mongoose = require('mongoose')
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard")


const saltRounds = 10
const router = new Router()

//Rutas
router.get('/signup', isLoggedIn,  (req,res,next) => res.render('auth/signup'))

router.post('/signup', (req,res,next) =>{
    const { username, password } = req.body

    if (!username === '' || !password === '') {
        res.render('auth/signup', {
          errorMessage: 'Please enter both, username and password to login.'
        });
        return;
      }

      const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create ({
                username,
                password:hashedPassword
            })
            .then((newUser)=>{
                console.log("nuevo usuario", newUser)
                const {username,_id} = newUser
                res.redirect("/userProfile")
            })
        })
        .catch(err => next(err))

})

router.get("/login", isLoggedOut, (req,res) =>{
    res.render("auth/login")
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    console.log('SESSION =====> ', req.session);
    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.'
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
          //res.render('users/user-profile', { userInSession: req.session.currentUser });
          res.redirect("/userProfile")
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });

module.exports = router