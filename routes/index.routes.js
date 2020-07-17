const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.controller');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));
router.get('/main', (req, res, next) => res.render('main'));
router.get('/private', indexController.renderPrivate);

module.exports = router;
