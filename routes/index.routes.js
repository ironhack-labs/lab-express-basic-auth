const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")

/* GET home page */
router.get('/', (req, res, next) => {
    console.log(req.session)
    if(req.session.count) {
        req.session.count += 1
    } else {
        req.session.count = 1
    }
    console.log(req.session.count)
    res.render('index')
})
module.exports = router;
