const express = require('express');
const router = express.Router();
const app = require("../app");
/* GET home page */
router.get('/', (req, res, next) => res.render('index'));




module.exports = router;
