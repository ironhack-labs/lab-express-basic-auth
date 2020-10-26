const express = require('express');
const router = express.Router();

const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
/* GET home page */
router.get('/signup', (req, res, next) => res.render('auth/signup'));


router.post("/signup", async (req, res, next) => {
    if (req.body.username === "" || req.body.password === "") {
      res.render("auth/signup", {
        errorMessage: "Indicate a username and a password to sign up",
      });
      return;
    }
  const { username, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);

  try {
    const user = await User.findOne({ username: username });
    // si existiera en la base de datos, renderizamos la vista de auth/signup con un mensaje de error
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The email already exists!",
      });
      return;
    }

    await User.create({
      username,
      password: hashPass,
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

// login
router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });
  

  router.post("/login", async (req, res, next) => {
    // validamos los datos que vienen del formulario
    if (req.body.username === "" || req.body.password === "") {
      res.render("auth/login", {
        errorMessage: "Indicate a username and a password to login",
      });
      return;
    }
  
    const { username, password } = req.body;
  
    try {
      // validar si el usuario existe en la BD
      const user = await User.findOne({ username: username });
      console.log(user);
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The email doesn't exist",
        });
        return;
      }
  
      if (bcrypt.compareSync(password, user.password)) {
        // guardar el usuario en la session
        req.session.currentUser = user;
        res.locals.currentUserInfo = user;
        res.locals.isUserLoggedIn = true;
        
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password",
        });
      }
  
      // validar si el password es correcto
    } catch (error) {}
  });


module.exports = router;
