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


//////////// LOGIN///////////
router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
 //console.log(email, password)
  console.log(req.body)
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
 
  User.findOne({ username })
    .then(user => {
      //console.log(user)
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        res.render('users/user-profile', { user });
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

//////////// OTHER ROUTES ////////////
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