const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.use((req,res,next)=> {
  req.session.currentUser ? next() : res.render('main', { errorMessage: 'Necesitas estar logeado para ver esta pagina'})
})


router.get("/private", (req,res) => {
  res.render("private", req.session.currentUser)
})




module.exports = router;
