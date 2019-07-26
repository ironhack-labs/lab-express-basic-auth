const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.render("index"));

// Middleware personalizado para identificar usuarios logueados
// Todas las rutas inferiores serán privadas
router.use((req, res, next) => {
  req.session.currentUser
    ? next()
    : res.render("login", {
        errorMessage: "Inicia sesión para acceder al area privada"
      });
});

// router.get("/private-area", (req, res, next) => res.render("private"));

module.exports = router;
