const express = require("express");
const router = express.Router();

const User = require("../models/User.models");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
//Agregamos la ruta de signup, que renderiza la vista /signup.hbs
router.get("/signup", (req, res, next) => {
  res.render("signup"); //es el nombre del archivo de la página(en este caso signup.hbs)
});

//recibe los datos del formulario de signup, toma los valores del form req.body y los asigna a constantes
//Genera el salt y hace hash del password con el salt
//Crea el objeto User y redirecciona

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  // validamos si los valores de los inputs llegan vacíos

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up",
    });
    return;
  }
  //buscar en la base de datos si existe el username
  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: " The username already exists",
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })
        .then(() => {
          res.redirect("/");
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      next(error);
    });
});
//renderiza el formulario de login
router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  //asignamos a variables los datos que vienen del formulario
  const { username, password } = req.body;
  // verificamos que los valores del form no lleguen vacíos
  if (username === "" || password === 22) {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login",
    });
    return;
  }

  //buscamos en la base de datos si existe un username con los datos del user que viene del form
  // si no lo encuentra, nos indica que el"user" no existe
  //sino, nos devuelve el "user"
  //usamos el método compareSync para hacer hash del formulario input y compararlo con el password guardado en la base de datos
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist",
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        //guarda el login en la sesión!
        //el objeto requerido tiene una propiedad llamada sesión donde podemos añadir valores.
        //que queremos guardar.En este caso, lo estamos llenando con la información del "user".
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password",
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
