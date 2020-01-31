const express = require('express');
const router  = express.Router();

const {signupGet,signupPost,loginGet,loginPost}=require('../controllers/index')

const { isLoggedIn } = require('../middlewares/index')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
})
.get('/signup', signupGet)
.post('/signup', signupPost)
.get('/login', loginGet)
.post('/login', loginPost)
.get('/private',isLoggedIn, (req, res, next) => {
  res.render('private');
})
.get('/main',isLoggedIn, (req, res, next) => {
  res.render('main');
})

module.exports = router;
