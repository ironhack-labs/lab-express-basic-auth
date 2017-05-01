var express = require('express');
var router = express.Router();

const auth = require('../helpers/auth')

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('User: ', req.session.currentUser)
  res.render('index', { title: 'Express' });
});

// router.use((req, res, next) => {
//   if (req.session.currentUser) {
//     next();
//   } else {
//     res.redirect("/login");
//   }
// });




router.get('/main', auth.checkLoggedIn('/login'), (req, res, next) => {
  res.render('main');
});

console.log("fhkfjdhfsdhkhfskj");
router.get('/private', auth.checkLoggedIn('/login'), (req, res, next) => {
  console.log("test");
  res.render('private');
})




module.exports = router;
