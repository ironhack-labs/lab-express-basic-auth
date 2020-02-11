const express = require('express');
const router  = express.Router();

const authRouter = require('./auth');
const loginRouter = require('./login');

const siteRouter = require('./site-routes');

router.use('/signup', authRouter);
router.use('/login', loginRouter);

router.use('/', siteRouter);



/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Lab auth'});
});

module.exports = router;
