const router = require("express").Router();

const { isLoggedIn } = require('./../middlewares/route-guard')


router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/main', isLoggedIn, (req, res, next) => {
  // console.log('conectado')
  // res.send('conectado')
  res.render('user/main-view')
})

router.get('/private', isLoggedIn, (req, res, next) => {
  // console.log('conectado')
  // res.send('conectado')
  res.render('user/private-view')
})

module.exports = router;
