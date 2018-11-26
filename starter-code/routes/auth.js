const router = require('express').Router()
const mongoose = require('mongoose')
const bycrypt = require('bcrypt')
const User = require('../models/user')


router.get('/signup', (req,res)=>{
    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
  res.render('index', {title:'Log In'});
});

module.exports = router