//1 Importamos Express
const express = require("express");
const User = require('../models/User.model');
const bcryptjs = require("bcryptjs");
const { isLoggedIn, isLoggedOut, private } = require('../middleware/route-guard.js');

//2 Inicializamos el router
const router = express.Router();

//localhost:3000/auth/signup
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

//Ruta para recibir los datos de req.body y guardarlos
 // get route is skipped
// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
    // console.log("The form data: ", req.body);
    const { username, password } = req.body;
    if (!username  || !password) {
        res.status(400)
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return
    }
  const saltRounds =10; 
  bcryptjs
    .genSalt(saltRounds) //generamos la primera parte del hash
    .then(salt => bcryptjs.hash(password, salt)) // gracias a hash creamos la contraseña encriptada
    .then(hashedPassword => {
      return User.create({
        username,
        password: hashedPassword 
      });
    })
    .then(user => {
      console.log('user created', user);
      res.redirect("/auth/user-profile") //hay que poner todo el caminito
    })
    .catch((err) => {
        console.log(err)
        res.status(500)
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
            res.status(500).render('auth/signup', {
            errorMessage: 'Username and email need to be unique. Either username or email is already used.'
            });
        } else {
            next(error);
        }
    });
});

router.get("/user-profile", isLoggedIn, (req, res) => {
    console.log(req.session.currentUser)
    res.render("users/user-profile",{ userInSession: req.session.currentUser })
});

router.get("/login",(req,res) =>{
    res.render("auth/login")
});

router.post('/login', (req, res, next) => {
    console.log(req.body)
    const { username, password } = req.body;
    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }
    User.findOne({ username })
      .then(user => {
        if (!user) { //si no existe el usuario
            res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
            return;
        } else if (bcryptjs.compareSync(password, user.password)) {
          //Aquí asignamos los datos de la cookie
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

  router.get('/main', private, (req,res)=>{
    res.render('main')
  });

  router.get('/private', private, (req,res)=>{
    res.render('private')
  });

module.exports = router;