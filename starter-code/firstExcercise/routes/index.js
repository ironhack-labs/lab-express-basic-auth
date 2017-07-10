/* jshint esversion : 6 */
var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Exercise' });
});

router.get("/secret",(req,res,next) => {
  router.use((req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
  });
  router.get("/secret", (req, res, next) => {
    res.render("secret");
  });
});






module.exports = router;
