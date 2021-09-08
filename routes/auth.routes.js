// REQUIRES
const { Router } = require('express');
const router = new Router();
// CODE SKIPED
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
// MODEL IMPORT
const User = require('../models/User.model');
/**********************************************************************/
/**********************************************************************/

/* FORM INICIO */
// GET route ==> to display the signup form
router.get('/signup', (req, res) => res.render('auth/signup'));

// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
  
    const { username, password } = req.body;
   
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create(
            {
                username: username,
                password: hashedPassword
            }
        );
      })
      .then(userFromDB => {
        res.redirect('/userProfile');
      })
      .catch(error => next(error));
  });


/**********************************************************************/
/* USER-PROFILE */
router.get('/userProfile', (req, res) => {
    res.render('user-profile.hbs')
})  

module.exports = router;
