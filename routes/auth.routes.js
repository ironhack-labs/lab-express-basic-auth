const mongoose = require('mongoose');
const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model')

router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', async (req, res) => {
    const {username, password} = req.body
    
    //checking the username and password are filled in
    if(!username || !password){
        res.render('auth/signup', {errorMessage: 'Please provide both the Username and Password'})
    }

    //check whether the username has been taken 
    const userDB = await User.findOne({username :username})
    if(userDB){
        console.log('check username works')
        res.render('auth/signup', {errorMessage :'Username has been taken'})
        return;
    }


    //password validation using regex
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(500).render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }
        

    bcryptjs
      .genSalt(10)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPass => {
        return User.create({username, passwordHash : hashedPass})
      })
      .then( userFromDB => {
        console.log('newly created user:', userFromDB)
        res.redirect('/userProfile')
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render('auth/signup', {
             errorMessage: 'Username and email need to be unique. Either username or email is already used.'
          });
        } else {
          next(error);
        }
      });

})


router.get('/userProfile', (req, res) => {
    res.render('users/user-profile')
})


router.get('/login', (req, res) => {
    res.render('auth/login')
})


router.post('/login', async (req, res) => {
    const {username, password} = req.body
    
    const userDB = await User.findOne({username :username})

    if(!userDB){
        console.log('user not registered')
        res.render('auth/login', {errorMessage :'Username does not exist, please signup before you try to login'})
        return;
    }else{
        userDBPass = userDB.passwordHash
    }

    bcryptjs
        .genSalt(10)
        .then(hashedPass => bcryptjs.compare(password, userDBPass))
        .then(data => {
            if(data){
                return res.redirect('/userProfile')
            }
        })
        .catch(error => console.log('error while loggin in', error))
    
})




module.exports = router;