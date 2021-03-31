const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/signup', (req, res) =>{
    res.render('./signup')
})

module.exports = router;
