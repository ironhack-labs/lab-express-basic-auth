const res = require("express/lib/response");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


function loginCheck() {
  return (req, res, next) => {
    if (req.session.user) {
      // then the user making the request is logged in
      // therefore user can proceed
      next()
    } else {
      res.redirect('/login')
    }
  }

}


router.get('/profile', loginCheck(), (req, res, next) => {
  const user = req.session.user
  res.render('profile', { user })
})


router.get('/mainPage', loginCheck(), (req, res, next) => {
  const user = req.session.user
  res.render('mainPage', { user })
})
router.get('/logout', (req, res, next) => {
  req.session.destroy()
  res.render('index')
})

module.exports = router;
