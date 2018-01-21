const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers');

router.get('/signup', authController.signup);

router.get('/login', authController.login);

module.exports = router;
