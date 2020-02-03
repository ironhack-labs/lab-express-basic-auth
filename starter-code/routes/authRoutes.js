//
const express = require('express');
const router  = express.Router();

/* GET /auth */
router.get('/', (req, res, next) => {
  res.render('index');
});

const {signUpPost, signUpView} = require('../controllers/authControllers')
router.get('/signup', signUpView)
router.post('/signup', signUpPost)

const {loginPost, loginView} = require('../controllers/authControllers')
router.get('/login', loginView)
router.post('/login', loginPost)


module.exports = router;
