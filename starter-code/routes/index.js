const express = require('express');
const router  = express.Router();

//variables for the different routes
const signupRouter = require('./signup');
const authRouter = require('./auth');
const loginRouter = require('./login');
const privateRouter = require('./private-routes')

//get privates
//router.use('/secret', privateRouter);
//Get /login
router.use('/login', loginRouter);
//Get /auth
router.use('/auth', authRouter);

//Get /signup
router.use('/signup', signupRouter);

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('./index');
});

module.exports = router;