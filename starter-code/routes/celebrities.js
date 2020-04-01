const express = require('express');
const router = express.Router();
const Celebrity = require('../models/Celebrity');

router.get('/', async (req, res, next) => {
    try {
        res.render('private/celebrities', { 'celebrities': await Celebrity.find() });
    } catch (err) {
        throw new Error(err);
    }
});

module.exports = router;