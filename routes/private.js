const express = require('express')
const router = express.Router();
const {
    privatePage
} = require('../controllers/private');

router.get('/private', privatePage)

module.exports = router