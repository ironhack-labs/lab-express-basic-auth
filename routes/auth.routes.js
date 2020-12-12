const {Router} = require('express');
const {signup, login, logout} = require('../controllers/auth.controllers');
const router = Router();

router.get('/signup',function(req, res){res.render('auth/signup')}).post('/signup', signup).get('/login',function(req, res){res.render('auth/login')}).post('/login', login).get('/logout',function(req, res){res.render('auth/logout')}).post('/logout', logout);

module.exports = router;
