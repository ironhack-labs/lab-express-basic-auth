const express = require('express');
const router = express.Router();
const checkLogin = require('../middleware/checkLogin');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


/* router.get('/main', checkLogin, (req, res, next) => {
    res.send('only for loggedin users')
  }) */
  

module.exports = router;
