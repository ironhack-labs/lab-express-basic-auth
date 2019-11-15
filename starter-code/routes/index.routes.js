const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.use((req, res, next) => {
  console.log(req.session)
  req.session.currentUser ? next() : res.redirect("/login")
})

router.get('/main', (req, res) => res.render('main', {
  user: req.session.currentUser
}));

router.get('/private', (req, res) => res.render('private', {
  user: req.session.currentUser
}));

module.exports = router;




