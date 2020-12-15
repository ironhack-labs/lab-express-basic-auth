const { Router } = require('express');
const router = new Router();
const baseModule = require('hbs');
const { request } = require('../app');
const User = require('../models/User.model.js')
const {newUser, checkCredentials, login, logout, logInCheck}= require('../controllers/auth.controllers')

router
    .get('/signup', (req, res) => {
        res.render('auth/signup') 
    })
    .get('/login', (req, res) => {
        res.render('auth/login')
    })
    .get('/main', logInCheck, (req, res) => {
        res.render('main')
    })
    .get('/private', logInCheck, (req, res) => {
        res.render('private')
    })
    .get('private', logInCheck, (req, res) => {
        res.render('private')
    })
    .post('/signup', checkCredentials, newUser)
    .post('/login', checkCredentials, login)

module.exports = router;
