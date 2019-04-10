const express = require('express');
const router  = express.Router();
const authController = require('../controllers/auth.controller')

/* GET home page */

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/register', authController.register)
router.post('/register', authController.doRegister)

router.get('/login', authController.login)
router.post('/login', authController.doLogin)

module.exports = router;