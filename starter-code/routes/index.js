const express = require('express');
const router  = express.Router();
const signUpRouter = require('./sign-up');
const loginRouter = require('./log-in');

router.use(["/sign-up", "/signup"], signUpRouter);
router.use(["/log-in", "/login"], loginRouter);

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
