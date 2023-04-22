const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // en esta ruta tengo la contraseña incriptada
// debemos instalar el paquete bcrypt.js, express-session y connect-mongo. dentro de conf. session.config.js
// recordar poner require("./config/session.config")(app); en app.js debajo de dovenv

const User = require("./../models/User.model");
const { isLoggedOut, isLoggedIn } = require("../middlewares/route-guard"); // ESTO ES NUEVO, SE USA EN EL GET PARA LOGEARSE, ESTA EN MIDDLEWARES,ROUTE-GUARD.JS
const { loginUser } = require("moongose/controller/user_controller");

const saltRounds = 10;

router.get("/sign-up", isLoggedOut, (req, res) => {
  res.render("auth/signup-form");
});

