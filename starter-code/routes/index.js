const express = require('express');
const router  = express.Router();

/* GET home page (Sign up page)*/
router.get('/', (req, res, next) => {
  //res.render('index');
  res.redirect('/auth/signup')
})

/* GET menu page after login */
router.get('/menu', (req, res) => {
  res.render('menu')
})

/* GET main page after login */
router.get('/main', (req, res) => {
  res.render('main')
})

/* GET private page after login */
router.get('/private', (req, res) => {
  res.render('private')
})

module.exports = router;
