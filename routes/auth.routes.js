//1 Importamos Express
const express = require("express");
//2 Inicializamos el router
const router = express.Router();

const User = require('../models/User.model');

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

router.get("/signup", (req,res) =>{
    res.render("auth/signup")
})

router.post('/signup', (req, res, next) => {
    // console.log("The form data: ", req.body);
   
    //tomar los datos del formulario
    const { username, password } = req.body;
   
    bcryptjs
      .genSalt(saltRounds)// generamaos la primera parte del hash
      .then(salt => bcryptjs.hash(password, salt))// creamos contraseña encriptada
      .then(hashedPassword => {
        return User.create({
          // username: username
          username,
          // passwordHash => this is the key from the User model
          //     ^
          //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
          password: hashedPassword
        });
      })
      .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
      })
      .catch(error => next(error));
  });

  

module.exports = router;