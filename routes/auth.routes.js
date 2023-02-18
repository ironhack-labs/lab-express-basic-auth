const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut} = require('../middleware/route-guard')

router.get("/signup", (req, res) => res.render("auth/signup"))

router.post("/signup", async (req, res, next) =>{
    try {
        let {username, password} = req.body //retrieve from form

        if (!username || !password){ //making sure all inputs are filled
            res.render("auth/signup", {errorMessage: "Please fill all fields"})
        }

        //checking of password (regEx)

        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        
        if (!regex.test(password)) {
        res.render('auth/signup', {
            errorMessage:
            'Your password needs to be at least 8 characters long and include lowercase letters and uppercase letters',
        })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        await User.create({ username, password: hashedPassword})
        res.redirect("/")

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError){
            res.render("auth/signup", {
                errorMessage: error.message
            })
        }
        console.log(error)
        next(error)
    }
})

router.get('/login', isLoggedOut, (req, res) => res.render('auth/login'));

router.post('/login', async (req, res, next) => {
    try {
      let { username, password } = req.body;
  
      if (!username || !password) {
        res.render('auth/login', { errorMessage: 'Please input all the fields' });
      }
  
      let user = await User.findOne({ username }); 
  
      if (!user) { //check if the username exists
        res.render('auth/login', { errorMessage: 'Account does not exist' });
      } else if (bcrypt.compareSync(password, user.password)) {
        
        req.session.user = user; //saving the user in the session
  
        res.redirect('/profile');
      } else { // in case only password is incorrect
        res.render('auth/login', { errorMessage: 'Wrong credentials' });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });


  router.get('/profile', isLoggedIn, (req, res) => {
    let user = req.session.user;
  
    res.render('profile', user);
  });


  router.get('/main', isLoggedIn, (req, res) => {
    let user = req.session.user;
  
    res.render('main', user);
  });

  router.get('/private', isLoggedIn, (req, res) => {
    let user = req.session.user;
  
    res.render('private', user);
  });

  router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
      if (err) next(err);
      else res.redirect('/');
    });
  });

  module.exports = router;