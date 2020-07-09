const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));
router.get('/signin', (req, res, next) => res.render('createUser'))

module.exports = router;
