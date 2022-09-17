//routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

//Get route to signup page

router.get('/signup', (request, response) =>{
    response.render('auth/signup');
})

// Post route to process form data 

router.post('/signup', (request, response,next) => {
    // response.send(request.body)
    const {username,password} = request.body;



    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          
          username:username,
          passwordHash: hashedPassword
        });
      })
      .then(userFromDB => {
        // console.log('Newly created user is: ', userFromDB);
        response.redirect('/userProfile');
      })
      .catch(error => next(error));

      router.get('/userProfile', (req, res) => res.render('users/user-profile'));
})




module.exports = router;