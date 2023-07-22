const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const User = require('../models/User.model');
const { default: mongoose } = require('mongoose');

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

const SALTROUNDS = 10;

//Proile page 
router.get('/profile', isLoggedIn, (req, res) => res.render('users/user-profile')
)

//Display sign up form GET
router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup')
)

//Handle creating of account 
router.post('/signup', isLoggedOut, async (req, res, next) => {
  const { email, password } = req.body

  if (isEmpty(email) || isEmpty(password)) {
    return res.render('auth/signup', { errorMessage: 'Email or password cannot be empty.' })
  }

  const passwordValidatorRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  const isPasswordValid = passwordValidatorRegex.test(password);

  if(!isPasswordValid){
    return res.status(500).render('auth/signup', {errorMessage:'Password must contain at least a special character, a number and between 6 - 16 characters long.'})
  }

  try {
    const salt = await bcryptjs.genSalt(SALTROUNDS);
    const passwordHash = await bcryptjs.hash(password, salt)
  
    const newUser = await User.create({ email, password: passwordHash });

    res.redirect('/profile')
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500)
      .render('auth/signup', { errorMessage: error.message });

    } else if(error.code === 11000){
      res.status(500)
      .render('auth/signup', {errorMessage: "Username and email need to be unique or email is already used."})

    } else{
      next(error);
    }
  }
});

//login
router.get('/login', isLoggedOut, (req, res) => {
  res.render('auth/login')
})

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body

  if (isEmpty(email) || isEmpty(password)) {
    return res.render('auth/login', { errorMessage: 'email or password cannot be empty' })
  }

  try {
    const user = await User.findOne({ email })
    if(!user){
      throw new Error('No user with the provided email')
    }
    const isPassword = await bcryptjs.compare(password, user.password);

    if(!isPassword){
      throw new Error('Password is incorrect')
    }

    req.session.currentUser = user
    req.app.locals.currentUser = user
  
    res.redirect('/profile')
  } catch (error) {
    console.log('error ', error);
    res.status(500)
    .render('auth/login', {errorMessage: error.message})
  }
});

//Handle logout route
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) next(err);
    req.app.locals.currentUser = null;
    res.redirect('/');
  });
})

// protected routes
router.get('/private', isLoggedIn, (req, res)=> {
  res.render('private/private');
})

router.get('/main', isLoggedIn, (req, res) => {
  res.render('private/main');
})

function isEmpty(value) {
  const strippedValue = value.trim();
  return !strippedValue.length
}


module.exports = router