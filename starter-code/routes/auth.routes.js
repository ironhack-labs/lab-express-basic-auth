const express = require('express');
const routes = express.Router();
const auth = require('../controllers/auth.controller')

routes.get('/signup', auth.signupForm)
routes.post('/signup',auth.signupRegister)

routes.get('/login', auth.loginForm)
routes.post('/login', auth.loginAttempt)

module.exports = routes;