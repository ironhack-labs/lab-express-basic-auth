const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;
const mongoose = require("mongoose");

//localhost:3000/signup

router.get("/signup", (req, res) => {
  res.render("signup");
});

//Ruta para registar un usuario

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  //Validaciones del formulario
  if (!username || !password) {
    res.render("signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        // username: username
        username,
        // passwordHash => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword,
      });
    })
    .then((userDb) => res.redirect("/userProfile"))
    .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render("signup", { errorMessage: error.message });
          } else if (error.code === 11000) {
            res.status(500).render("signup", {
              errorMessage:
                "Username need to be unique. Either username or email is already used.",
            });
          } else {
            next(error);
          }
    });
});

router.get("/userProfile", (req, res) => {
    console.log(req.session)
    res.render("users/user-profile",{ datosUsuario: req.session.datosUsuario })
    });

    router.get("/login", (req,res)=>res.render("login"));

    router.post("/logout",(req,res,next)=>{
        req.session.destroy(err => {
            if (err) next(err);
            res.redirect('/');
          });
    })
    
    
    // POST login route ==> to process form data
router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const { username, password } = req.body;
   
    if (username === '' || password === '') {
      res.render('login', {
        errorMessage: 'Please enter both, username and password to login.'
      });
      return;
    }
   
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.render('login', { errorMessage: 'username is not registered. Try with other username.' });
          return;
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
            //
          req.session.datosUsuario=user;
          console.log(req.session);  
          res.render('users/user-profile', { user });
        } else {
          res.render('login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });

module.exports = router;
