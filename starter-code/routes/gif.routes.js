const express = require('express');
const router  = express.Router();


router.get('/menu', (req, res) => res.render('menu'))


router.use((req, res, next) => {
  req.session.currentUser ? next() : res.render("gif", { errorMessage: "Inicia sesión para acceder al area privada" });
})

router.get("/private-gif", (req, res, next) => res.render("gif"))



module.exports = router;
