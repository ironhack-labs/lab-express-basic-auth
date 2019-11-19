const express = require('express');
const router  = express.Router();

const authRouter = require('./auth');
const signupRouter = require('./signup');


// *  '/auth'
router.use('/auth', authRouter);

// *  '/signup'
router.use('/signup', signupRouter);


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Authentication Page'});
});

module.exports = router;
