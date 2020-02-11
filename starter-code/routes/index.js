const express = require('express');
const router  = express.Router();

const authRouter = require('./auth');
const logRouter = require('./login');
const mainRouter = require('./main');
const privateRouter = require('./private');


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.use('/signup', authRouter);
router.use('/login', logRouter);
router.use('/main', mainRouter);
router.use('/private', privateRouter);

module.exports = router;
