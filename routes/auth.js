const router = require("express").Router();
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User.model')

// GET form to sign in
router.get('/signup', (req, res, next) =>{
  res.render('createUser')
})

// POST sign in new user
router.post('/signup', async (req, res, next) => {
  const {username, password} = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const createUser = await User.create({username, password: hashedPassword})
    res.render('createUser', {justCreatedUser: createUser.username})
  } catch (err) {
    console.log('Error:', err)
  }
})

module.exports = router;