const express = require("express");
const router = express.Router();

const common = require('../controllers/common.controller');
// Misc routes
router.get('/', common.home);

module.exports = router;