const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');

const User = require('../models/user.model');
const authController = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controllers');

router.get('/login', userController.showLoginPage);
 
router.post('/login', userController.checkToLogin);

router.get('/user-profile',  authController.isAuthenticated, userController.showUserProfile );

router.get('/main', authController.isAuthenticated, userController.showMainPage );

router.get('/private', authController.isAuthenticated, userController.showPrivatePage );


module.exports = router;