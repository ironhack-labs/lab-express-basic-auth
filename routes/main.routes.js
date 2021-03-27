const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User.model')

router.get('/main', (req, res) =>{
    res.render('main')
})

module.exports = router