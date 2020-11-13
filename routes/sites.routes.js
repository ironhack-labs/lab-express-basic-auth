const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose')
const User     = require('../models/User.model')
const bcrypt   = require('bcryptjs')
const bcryptsalt = 10



router.use((req, res, next) => {
    if(req.session.currentUser) {
        next()
    }else {
        res.render('main')
    }
})
router.get('/', (req, res, next) => {
    res.render('user-page')
})



module.exports = router