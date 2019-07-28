const express = require('express');
const router  = express.Router();


router.get('/menu', (req, res) => res.render('menu'))


router.use((req, res, next) => {
  req.session.currentUser ? next() : res.render("gato", { errorMessage: "Inicia sesión para acceder al area privada" });
})

router.get("/private-cat", (req, res, next) => res.render("gato"))



module.exports = router;

