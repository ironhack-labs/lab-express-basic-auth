//1 Importamos Express
const express = require("express");
const User = require('../models/User.model');
const bcryptjs = require("bcryptjs")
//2 Inicializamos el router
const router = express.Router();


//3 Creamos las rutas

//localhost:3000/auth/signup
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

//Ruta para recibir los datos de req.body y guardarlos
 // get route is skipped
// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
  // console.log("The form data: ", req.body);
  const { username, email, password } = req.body;
  const saltRounds = 10;
  bcryptjs
    .genSalt(saltRounds)//generamos la primera parte del hash
    .then(salt => bcryptjs.hash(password, salt))// gracias al metodo hash creamos la contraseña encriptada
    .then(hashedPassword => {
      return User.create({
        // username: username
        username,
        email,
        // passwordHash => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
    })
    .catch(error => next(error));
});


module.exports = router;