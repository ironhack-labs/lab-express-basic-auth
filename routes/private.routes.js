const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User.model')

router.get('/private', (req, res) =>{
    res.render('private')
})

module.exports = router