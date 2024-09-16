const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth.controllers');
const authMiddleware = require('../middlewares/auth.middlewares');


router.get('/signUp', authMiddleware.isNotAuthenticated, authControllers.signup)
router.post('/signUp', authMiddleware.isNotAuthenticated, authControllers.doSignUp)

router.get('/login', authMiddleware.isNotAuthenticated, authControllers.login)
router.post('/login', authMiddleware.isNotAuthenticated, authControllers.doLogin)

router.get('/logout', authMiddleware.isAuthenticated, authControllers.logout)

module.exports = router