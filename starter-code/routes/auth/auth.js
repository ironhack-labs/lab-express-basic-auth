const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  // Aqui no se considera el slash en la ruta
  res.render("auth/login");
});

module.exports = router;
