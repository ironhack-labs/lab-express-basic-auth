//routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const mongoose= require('mongoose');
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard.js');


/////////////////// SIGNUP //////////////////////////////////////
//Get route to signup page

router.get('/signup',isLoggedOut, (request, response) =>{
    response.render('auth/signup');
})

// Post route to process form data 

router.post('/signup',isLoggedOut, (request, response,next) => {
    // console.log('The form data: ',request.body);
    const {username,email, password} = request.body;
      

   // make sure users fill all mandatory fields:
   if(!username || !email || !password){
     response.render('auth/signup', {errorMessage:'All fields are mandatory. Please provide your username , email and password.'});
     return;
   }

    // make sure passwords are strong;

      const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      if(!regex.test(password)){
        response.status(500).render('auth/signup', {errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.'});
        return;
      }
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        console.log(`Password hash: ${hashedPassword}`);
        return User.create({
          
          username:username,
          email: email,
          passwordHash: hashedPassword
        });
      })
      .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
        response.redirect('/userProfile');
      })
  
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          response.status(500).render('auth/signup', { errorMessage: error.message });
      }
            // make sure data in database is clean with no duplicates
         else if(error.code === 11000){
          response.render('auth/signup', {errorMessage: 'Username and email need to be unique. Either username or email is already used.'})
         } else {
          next(error);
         }
      });// close .catch()

}) // close .post()

////////////////////////////// LOGIN /////////////////////////////////////////


// GET ROUTE to display the login form to users

router.get('/login',isLoggedOut, (request, response) => {
  response.render('auth/login.hbs');
})

// POSt login route  to process form data

router.post('/login',isLoggedOut, (request, response, next) =>{
 console.log('SESSION =====>', request.session);

 const {email, password} = request.body;

if(email ===''|| password ==='' ){
  response.render('auth/login', {errorMessage: 'Please enter both , email and password to log in.'});
  return;
} 

User.findOne({email})
.then( function (user) {
  // console.log(user);

  if(!user){
    // console.log('No user found in DB')
    response.render('auth/login', {errorMessage: 'Email is not registered. try again or use other email.'});
    return ;
  } else if(bcryptjs.compareSync(password, user.passwordHash)){
    // console.log('welcome back', user);
    // response.render('users/user-profile', {user});


    // save user in the session 
    request.session.CurrentUser = user;
    console.log(request.session)
    response.redirect('/userProfile')
  } else {
    response.render('auth/login', {errorMessage: 'Incorrect password.'});
  }
})

});


router.get('/userProfile', (request, response) => {
  response.render('users/user-profile', {userInSession: request.session.CurrentUser});
});

router.post('/logout', (request, response, next) => {
  request.session.destroy( function(error) {
    if(error){
      next(error);
    }
    response.redirect('/');
  })
})



module.exports = router;