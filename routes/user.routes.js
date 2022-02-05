const router = require("express").Router();
const User = require("../models/User.model");

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get('/user', isLoggedIn ,(req, res, next) => res.render('user/user',{ user: req.session.currentUser}));

module.exports = router;