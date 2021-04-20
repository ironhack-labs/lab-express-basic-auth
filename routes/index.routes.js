const express = require('express');
const router = express.Router();

//Landing page where you also have the sign up
router.get('/', (req, res, next) => res.render('index'));

//

module.exports = router;
