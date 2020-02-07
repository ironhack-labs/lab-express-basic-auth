const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/main', (req, res, next) => {
  res.render('main');
});


router.use((req, res, next) => req.session.currentUser ? next() : res.redirect("/main"))


router.get("/profile", (req, res) => res.render("profile"));

module.exports = router;
