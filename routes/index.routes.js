const express = require('express');
const router = express.Router();
const protectRoute = require("../middlewares/protectedRoute");


/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


/*AUTH*/
router.get('/main', (req, res, next) => {
    res.render('main')
})

router.get('/private', protectRoute, (req, res, next) => {
    res.render('private')
})


module.exports = router;
