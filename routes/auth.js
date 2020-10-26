const express = require("express");
const router = express.Router();

// requerimos el paquete jsonwebtoken
const jwt = require("jsonwebtoken");

// requerimos el middleware
const withAuth = require("../helpers/middleware");

// User model
const User = require("../models/User.model");

// BCrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const { findOne } = require("../models/User.model");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
  });
  
  router.post("/signup", async (req, res, next) => {
    // validamos los datos que vienen del formulario
    if (req.body.email === "" || req.body.password === "") {
      res.render("auth/signup", {
        errorMessage: "Indicate a username and a password to sign up",
      });
      return;
    }
  
    // desestructuramos el email y el password de req.body
    const { email, password } = req.body;
  
    // creamos la salt y hacemos hash del password
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
  
    try {
      // buscar el usuario por el campo email
      const user = await User.findOne({ email: email });
      // si existiera en la base de datos, renderizamos la vista de auth/signup con un mensaje de error
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The email already exists!",
        });
        return;
      }
  
      await User.create({
        email,
        password: hashPass,
      });
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  });

  router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });
  
  router.post("/login", async (req, res, next) => {
    // si alguna de estas variables no tiene un valor, renderizamos la vista de auth/signup con un mensaje de error
    if (req.body.email === "" || req.body.password === "") {
      res.render("auth/login", {
        errorMessage: "Please enter a username and/or password to sign up.",
      });
      return;
    }
  
    // desestructuramos el email y el password de req.body
    const { email, password } = req.body;
  
    try {
      // revisamos si el usuario existe en BD
      const user = await User.findOne({ email });
      // si el usuario no existe, renderizamos la vista de auth/login con un mensaje de error
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The email doesn't exist",
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        // generamos el token
        const userWithoutPass = await User.findOne({ email }).select("-password");
        const payload = { userWithoutPass };
        // creamos el token usando el método sign, el string de secret session y el expiring time
        const token = jwt.sign(payload, process.env.SECRET_SESSION, {
          expiresIn: "1h"
        });
        // enviamos en la respuesta una cookie con el token y luego redirigimos a la home
        res.cookie("token", token, { httpOnly: true });
        res.status(200).redirect("/");
      } else {
        // en caso contrario, renderizamos la vista de auth/login con un mensaje de error
        res.render("auth/login", {
          errorMessage: "Incorrect password",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

  router.get('/main', withAuth, (req, res, next ) =>{
    if (req.user) {
        res.render("auth/main", { user: req.user });
      } else {
        res.redirect("/");
      }
  });
  
  router.get("/logout", withAuth, (req, res, next) => {
    // seteamos el token con un valor vacío y una fecha de expiración en el pasado (Jan 1st 1970 00:00:00 GMT)
    res.cookie("token", "", { expires: new Date(0) });
    res.redirect("/");
  });

  module.exports = router;