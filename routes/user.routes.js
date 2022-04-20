// routes/auth.routes.js
 
const { Router } = require('express');
const router = new Router();

const User = require('../models/User.model');

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get('/profile', isLoggedIn, (req, res, next) => res.render('users/profile',{ userSession: req.session.currentUser }));



module.exports = router;