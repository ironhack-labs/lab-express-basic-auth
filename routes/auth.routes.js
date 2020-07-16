const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller')

router.get('/signup', authController.signup);
router.post('/signup',authController.createUser);

router.get('/login', authController.renderLogin);
router.post('/login', authController.doLogin);

module.exports = router;
