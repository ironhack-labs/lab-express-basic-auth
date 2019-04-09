const express = require('express');
const router  = express.Router();
const authController = require('../controllers/auth.controller')

/* GET home page */

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/register', authController.register)
router.post('/login', authController.doRegister)

router.get('/login', authController.login)
router.post('/', authController.doLogin)

module.exports = router;