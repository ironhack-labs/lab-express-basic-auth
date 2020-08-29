const express = require('express')
const router = express.Router();
const {
    mainPage
} = require('../controllers/main');

router.get('/main', mainPage)

module.exports = router