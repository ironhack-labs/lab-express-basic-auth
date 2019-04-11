const express = require('express');
const router  = express.Router();
const authController = require('../controllers/auth.controller')


/* GET home page */

router.get('/register', authController.register)
router.post('/register', authController.doRegister)

router.get('/login', authController.login)
router.post('/login', authController.doLogin)

router.get('/logout', authController.logout);

module.exports = router;