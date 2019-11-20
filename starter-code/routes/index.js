const express = require('express');
const router  = express.Router();

const authRouter = require('./auth');
const loginRouter = require('./login');
const signupRouter = require('./signup');
const logoutRouter = require('./logout');


// *  '/auth'
router.use('/auth', authRouter);

// *  '/login'
router.use('/login', loginRouter);

// *  '/signup'
router.use('/signup', signupRouter);

// *  '/logout'
router.use('/logout', logoutRouter);

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
