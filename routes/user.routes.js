const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user.controllers');
const authMiddleware = require('../middlewares/auth.middlewares');

router.get('/profile', authMiddleware.isAuthenticated, userControllers.profile)


module.exports = router;