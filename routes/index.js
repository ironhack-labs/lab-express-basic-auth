const User = require("../models/User.model");
const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

/* GET home page */
router.get("/", (req, res, next) => {
  console.log(req.session)
  res.render("index");
});

// router.get('/user-:id', (req, res) => {
//   User.findOne({username: req.params.id})
//   .then(user => {
//     res.render('userprofile', user)
//   })
// })

router.get('/main', isLoggedIn, (req, res) => {
  res.render('main')
})

router.get('/private', isLoggedIn, (req, res) => {
  res.render('private')
})

module.exports = router;
