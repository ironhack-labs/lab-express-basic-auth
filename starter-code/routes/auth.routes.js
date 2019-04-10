const express = require('express');
const router  = express.Router();
const authController = require('../controller/auth.controller')


/* GET home page */
router.get('/register',authController.register);
router.post('/register', authController.doRegister)

module.exports = router;
