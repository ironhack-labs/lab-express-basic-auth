const express = require('express');
const router  = express.Router();
const signupRouter = require('./signup');
const loginRouter = require('./login');
const logoutRouter = require('./logout');
const authRouter = require('./auth');

router.use('/auth', authRouter);

router.use('/login', loginRouter);

// *  '/logout'
router.use('/logout', logoutRouter);

// *  '/signup'
router.use('/signup', signupRouter);

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
