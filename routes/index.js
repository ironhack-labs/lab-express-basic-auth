const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// MIDDLEWARE DETECTOR DE SESIÓN
router.use((req, res, next) => {
  console.log(req.session)
  req.session.currentUser ? next() : res.render('main', { errorMessage: 'Necesitas estar logeado para ver esta página' })
})

//RUTAS PROTEGIDAS
router.get("/private", (req, res) => {
  res.render("private", req.session.currentUser)
})

module.exports = router;
