const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.use((req, res, next) => {
  if(req.session.currentUser){
    next()
  }else {
    res.render("signup", { errorMessage: "Por favor inicia sesión para la party"})
  }
})

router.get("/private-area", (req, res, next)=> res.render("private"))
module.exports = router;
