const router = require("express").Router();

/* GET home page */




router.get("/", (req, res, next) => {
  res.render("index");
});


// MIDDLEWARE DETECTOR DE SESIÓN
router.use((req, res, next) => {
  console.log(req.session)
  req.session.currentUser ? next() : res.render('main', { errorMessage: 'Necesitas estar logeado para ver esta página' })
});


router.get('/private', (req, res, next) => {
  //res.send("has accedido a la zona SUPERPRIVADA")
  res.render("private")
});



module.exports = router;
