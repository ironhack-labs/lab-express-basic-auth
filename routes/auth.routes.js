const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');

//////////// SIGNUP///////////
router.get('/signup', (req, res) => res.render('auth/signup'));
 
router.post('/signup', (req, res, next) => {
   // console.log('The form data: ', req.body);

   const { username, password } = req.body; 

   bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
    return User.create({
      username,
      passwordHash: hashedPassword
    });
  })
  .then(userFromDB => {
    //console.log('Newly created user is: ', userFromDB);
    res.redirect('/userProfile');
  })
  .catch(error => next(error));
});

//////////// ROUTES ////////////
router.get('/userProfile', (req, res) => res.render('users/user-profile'));




module.exports = router;
        

   

/* router.post('/signup', (req, res, next) => {
  // console.log('The form data: ', req.body);

  const { username, password } = req.body; 

  bcryptjs
 .genSalt(saltRounds)
 .then(salt => bcryptjs.hash(password, salt))
 .then(hashedPassword => {
     console.log(`Password hash: ${hashedPassword}`);
 })
 .catch(error => next(error));
});
 */