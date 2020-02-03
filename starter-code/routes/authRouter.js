const express = require("express");
const router = express.Router();
const Users = require("../models/User");

// Show the list celebrity in celebrity/index
router.get("/", async (req, res, next) => {
  res.render("login/");
});

// Create: Submit & Process form data
router.post("/", async (req, res, next) => {
  const { username, password } = req.body;
  const addUser = new Users({ username, password }); //Crear nueva entrada
  try {
    await addUser.save(); //Guardar objeto .save()
    res.redirect("/");
  } catch (err) {
    console.log("este es el error", err);
    res.render("login/");
    next();
  }
});

module.exports = router;
