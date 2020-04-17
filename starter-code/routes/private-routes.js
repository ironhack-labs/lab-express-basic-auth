const express = require('express');
const router = express.Router();

router.use((req, res, next) => req.session.currentUser ? next() : res.redirect('/login'))

router.get('/funny-cat', (req, res, next) => {
    res.render('private-views/funny-cat', req.session.currentUser)
})

router.get('/cool-gif', (req, res, next) => {
    res.render('private-views/cool-gif', req.session.currentUser)
})

module.exports = router;