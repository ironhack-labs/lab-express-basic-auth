const express = require("express");
const router = express.Router();// User model
// const withAuth = require("../helpers/middleware");
const User = require("../models/User.model");// BCrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const { findOne } = require("../models/User.model");
const bcryptSalt = 10;router.get('/', (req, res, next) => {
    res.render('index');
  });router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});router.post("/signup", async (req, res, next) => {
  // desestructuramos el email y el password de req.body
  const { email, password } = req.body;  if (req.email === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up",
    });
    return;
  }  // creamos la salt y hacemos hash del password
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);  try {
    // buscamos el usuario por el campo email
    const user = await User.findOne({ email: email });
    // si existiera en la base de datos, renderizamos la vista de auth/signup con un mensaje de error
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists!",
      });
      return;
    }    // creamos el usuario y luego redirigimos a '/'
    await User.create({
      email,
      password: hashPass,
    });
    res.render("index", { message: "User created" });
  } catch (error) {
    next(error);
  }
});

// router.get("/private", withAuth, (req, res, next) => {
//     // si existe req.user, quiere decir que el middleware withAuth ha devuelto el control a esta ruta y renderizamos la vista secret con los datos del user
//     if (req.user) {
//       res.render("private", { user: req.user });
//     } else {
//       res.redirect("/");
//     }
//   });
  

//login
router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });  router.post("/login", async (req, res, next) => {
    // validamos los datos que vienen del formulario
    if (req.body.email === "" || req.body.password === "") {
      res.render("auth/login", {
        errorMessage: "Indicate a username and a password to login",
      });
      return;
    }    const { email, password } = req.body;    try {
      // validar si el usuario existe en la BD
      const user = await User.findOne({ email: email });      if (!user) {
        res.render("auth/login", {
          errorMessage: "The email doesn't exist",
        });
        return;
      }      if (bcrypt.compareSync(password, user.password)) {
        // guardar el usuario en la session
        console.log(user, "hola");
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password",
        });
      }      // validar si el password es correcto
    } catch (error) {
        console.log(error)
    }



  });
  
  
  
  
  module.exports = router;