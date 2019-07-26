const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


// router.use((req, res, next) => {
//   req.session.currentUser ? next() : res.render("login", { errorMessage: "Inicia sesión para acceder al area privada" });
// })

// router.get("/private", (req, res, next) => res.render("private"))

module.exports = router;
