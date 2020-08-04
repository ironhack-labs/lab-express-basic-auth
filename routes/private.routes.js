const express = require('express');
const router = express.Router();

router.get('/main', (req,res) => {
    res.render('main.hbs')
})

router.get('/private', (req,res) => {
    res.render('private.hbs')
})

module.exports = router;