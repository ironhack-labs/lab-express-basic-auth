//1 Importamos Express
const express = require("express");
//2 Inicializamos el router
const router = express.Router();
//Requerimos nuestro modelo
const User = require('../models/User.model');
const bcryptjs = require("bcryptjs")
const mongoose = require("mongoose");
//Requerimos nuestro middlewares
const { isLoggedIn, isLoggedOut } = require('../middlewares/cadeneros.js');

//3 Creamos las rutas

//Ruta para mostrar la vista del formulario Sign up
//localhost:3000/auth/signup
router.get("/signup", (req, res) => {
    res.render("auth/signup");
  });

//Ruta para recabar datos del formulario Sign up
//localhost:3000/auth/signup
router.post("/signup", (req, res, next) => {
  //Tomar los datos del fomulario:
  console.log("The form data: ", req.body);
  
  const { username, password } = req.body;
  //nuestro candado de segutidad
  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
    return;
  }

  const saltRounds = 10;// no se mueve este valor
  bcryptjs
    .genSalt(saltRounds)//Generamos la 1a parte del hash
    .then(salt => bcryptjs.hash(password, salt)) //gracias al metodo hash creamos la contraseña
    .then(hashedPassword => {
      return User.create({
        // username: username
        username,
        // passwordHash => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      res.redirect("/auth/user-profile")
    })
    .catch((error) => {
      // copy the following if-else statement
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
    } else {
        next(error);
    }
    });
});

//Ruta para mostrar la vista del Perfil del usuario
//localhost:3000/auth/user-profile
router.get("/user-profile", isLoggedIn, (req, res) => {
  const {currentUser} = req.session;
  console.log("req", req.session);
  res.render("auth/user-profile", {userInSession: currentUser});
});


//Ruta para mostrar la vista de inicio de sesión
//localhost:3000/auth/login
router.get("/login", (req, res) => {
  res.render("auth/login")
})

//Ruta guardar los datos de la vista de inicio de sesión
//localhost:3000/auth/login
router.post("/login", (req, res, next) => {
  console.log("SESSION", req.session)
  const { username, password } = req.body;
 
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
 
  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'User name is not registered. Try with other user name.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //Asignamos los datos de la cookie
        req.session.currentUser = user;
        res.redirect('/auth/user-profile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});



//Ruta para mostrar la vista 1. Protegida por autenticación
//localhost:3000/auth/login
router.get("/main", cadenero, (req, res, next) => {
  res.render("auth/main")
})

//Ruta para mostrar la vista 2. Protegida por autenticación
//localhost:3000/auth/login
router.get("/private", cadenero, (req, res, next) => {
  res.render("auth/private")
})

// Middleware
function cadenero(req, res, next){
  if(req.session.currentUser){
    //nos ayuda a continuar el flujo
    next()
  }else {
    res.redirect("/");
  }
  
}

  module.exports = router;