const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const User = require('../models/User.model')

const SALTROUNDS = 10;

//Proile page 
router.get('/profile', (req, res) => res.render('users/user-profile')
)

//Display sign up form GET
router.get('/signup', (req, res) => res.render('auth/signup')
)

//Handle creating of account 
router.post('/signup', async (req, res, next) => {
  const {email, password} = req.body
  console.log('email ', email);
  console.log('password ', password);

  if(isEmpty(email) || isEmpty(password)){
    return res.render('auth/signup', {errorMessage: 'email or password cannot be empty'})
  }

  try{
    const salt = await bcryptjs.genSalt(SALTROUNDS);
    const passwordHash = await bcryptjs.hash(password, salt)

    const newUser = await User.create({email, password: passwordHash});
   

    res.redirect('/profile')

  }catch(error){
    next(error);
  }
})

function isEmpty(value){
  const strippedValue = value.trim();
  return !strippedValue.length
}


module.exports = router