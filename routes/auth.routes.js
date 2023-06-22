const express = require('express');
const userRouter = express.Router();
const { 
    getSignup,
    postSignup,
    getLogin,
    postLogin,
    getProfile,
    getLogout,
    getMain,
    getPrivate
} = require('../controllers/auth.controller')

const {  isLoggedIn, isLoggedOut } = require('../middleware/guard.route.middleware')


userRouter.get('/signup', isLoggedOut, getSignup);

userRouter.post('/signup', postSignup);

userRouter.get('/login', getLogin);

userRouter.post('/login', postLogin)

userRouter.get('/profile', isLoggedIn, getProfile)

userRouter.get('/logout', isLoggedIn, getLogout)

userRouter.get('/main', isLoggedIn, getMain)

userRouter.get('/private', isLoggedIn, getPrivate)

module.exports = userRouter;