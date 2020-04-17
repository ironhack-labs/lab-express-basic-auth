const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.use((req, res, next) => req.session.currentUser ? next() : res.redirect("/login"))

router.get('/main', (req, res, next) => res.render('main', req.session.currentUser))
router.get('/private', (req, res, next) => res.render('private', req.session.currentUser))

module.exports = router;
