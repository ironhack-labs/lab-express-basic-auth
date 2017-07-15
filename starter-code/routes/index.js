var express = require('express');
var router = express.Router();
function auth (req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/secret', auth, (req, res, next)=>{
    res.render('secret');
})

router.get('/main', auth, (req, res, next)=>{
    res.render('main');
})

router.get('/private', auth, (req, res, next)=>{
    res.render('private');
})

module.exports = router;
