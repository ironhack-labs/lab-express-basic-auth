const express = require('express');
const router = express.Router();


//Add the model

const User = require('../models/User');

//bcrypt para encriptar los passwords

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/* GET home page */
router.get("/", (req, res, next) => {
    res.render("home");
  });

//Agregamos la ruta de signup, que renderiza la vista auth/signup.hbs

router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
  });

  
//recibe los datos del formulario de signup, toma los valores del form req.body y los asigna a constantes
//Genera el salt y hace hash del password con el salt
//Crea el objeto User y redirecciona

router.post("/signup", (req, res, next) => {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
  
    // validamos si los valores de los inputs llegan vacíos
  
    if (username === "" || password === "") {
      res.render("auth/signup", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }

//busco en la BD si existe el username

User.findOne({ username: username })
.then(user => {
  if (user !== null) {
    res.render("auth/signup", {
      errorMessage: "The username already exists!"
    });
    return;
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    username,
    password: hashPass
  })
    .then(() => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    });
})
.catch(error => {
  next(error);
});
});  

//renderiza el formulario de login

router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });
  
  router.post("/login", (req, res, next) => {
    //asignamos a variables los datos que vienen del form
    const theUsername = req.body.username;
    const thePassword = req.body.password;
  
    //verificamos que los valores del form no lleguen vacíos
    if (theUsername === "" || thePassword === "") {
      res.render("auth/login", {
        errorMessage: "Please enter both, username and password to sign up."
      });
      return;
    }
  
    // buscamos en la BD si existe un username con los datos del user que vienen del form
    // si no lo encuentra, nos dice que el user no existe
    // sino, nos devuelve el user
    // usamos el método compareSync para hacer hash del form input y compararlo con el password guardado en la BD
  
    User.findOne({ username: theUsername })
      .then(user => {
        if (!user) {
          res.render("auth/login", {
            errorMessage: "The username doesn't exist."
          });
          return;
        }
        if (bcrypt.compareSync(thePassword, user.password)) {
          // Save the login in the session!
          //the request object has a property called session where we can add the values we want to store on it. In this case, we are setting it up with the user’s information.
          req.session.currentUser = user;
          res.redirect("user/main");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      })
      .catch(error => {
        next(error);
      });
  });
  
  router.get("/logout", (req, res, next) => {
    req.session.destroy(err => {
      // cannot access session here
      res.redirect("/login");
    });
  });
  
  //exportamos el modulo
  
  module.exports = router;
  