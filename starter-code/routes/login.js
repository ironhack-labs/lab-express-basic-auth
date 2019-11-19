const express = require('express');
const router = express.Router();

//get login

router.get('/', (req,res,next) => res.render('./login'))

module.exports = router;