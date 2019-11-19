const express = require('express');
const router  = express.Router();

const authRouter = require('./auth');
const loginRouter = require('./login');

/*
const logoutRouter = require('./logout');
const signupRouter = require('./signup');
*/

// *  '/auth'
router.use('/auth', authRouter);

// *  '/login'
router.use('/login', loginRouter);
/*
// *  '/logout'
router.use('/logout', logoutRouter);

// *  '/signup'
router.use('/signup', signupRouter);*/



/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;

