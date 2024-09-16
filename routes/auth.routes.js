const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/signup', authMiddleware.isNotAuthenticated, authController.signup);
router.post('/signup', authMiddleware.isNotAuthenticated, authController.doSignup);

router.get('/login', authMiddleware.isNotAuthenticated, authController.login);
router.post('/login', authMiddleware.isNotAuthenticated, authController.doLogin);

router.get('/logout', authMiddleware.isAuthenticated, authController.logout);

module.exports = router;