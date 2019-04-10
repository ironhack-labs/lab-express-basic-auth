const express = require('express')
const router = express.Router()
const miscController = require('../controller/misc.controller')

router.get('/',miscController.home)

module.exports = router;