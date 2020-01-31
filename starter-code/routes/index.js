const express = require('express');
const router  = express.Router();

const {signupGet,signupPost,loginGet,loginPost}=require('../controllers/index')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
})
.get('/signup', signupGet)
.post('/signup', signupPost)
.get('/login', loginGet)
.post('/login', loginPost)

module.exports = router;
