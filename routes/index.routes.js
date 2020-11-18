const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
    const loggedInUser = req.session.user;
    console.log(loggedInUser);
    res.render('index', {user: loggedInUser})});


module.exports = router;