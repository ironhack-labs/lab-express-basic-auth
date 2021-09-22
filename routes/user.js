const express = require("express");
const router = express.Router();

const userController = require("./../controllers/userController");

// GET - Obtener perfil del usuario

router.get("/profile", userController.createProfile);

module.exports = router;
