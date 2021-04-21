const express = require('express');
const router = express.Router();

router.get('/signup', (req, res, next) => res.status(200).render('auth/signup'));

module.exports = router;
