const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("index");
});

router.use((req, res, next) => {
  console.log(req.session)
  req.session.currentUser ? next() : res.render('auth/login', { errorMessage: 'Primero tienes que registrarte' })
})

router.get("/profile", (req, res) => {
  res.render("profile-page", req.session.currentUser)
})

module.exports = router;
