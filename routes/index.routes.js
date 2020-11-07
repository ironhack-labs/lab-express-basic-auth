const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
    if (req.session.currentUser) return res.render('index', { user: req.session.currentUser, tittle: `Welcome: ${req.session.currentUser}`, layout: 'profile/layout' });
    return res.render('index', { title: 'Ironlock', });

});

module.exports = router;
