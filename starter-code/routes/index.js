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


router.get('/private', auth.checkLoggedIn('/login'), (req, res, next) => {
  res.render('private');
})

// router.get('/private3', auth.checkLogged, (req, res, next) => {
//   res.render('home');
// })

router.get('/main', auth.checkLoggedIn('/login'), (req, res, next) => {
  res.render('main');
})


module.exports = router;
