var express = require('express');
var router = express.Router();

const authRouter = require('./auth');
const loginRouter = require('./login');
// const logoutRouter = require('./logout');
const signupRouter = require('./signup');

// *  '/auth'
router.use('/auth', authRouter);

  '/login'
router.use('/login', loginRouter);

// *  '/logout'
// router.use('/logout', logoutRouter);

// *  '/signup'
router.use('/signup', signupRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Auth Demo' });
});

module.exports = router;
