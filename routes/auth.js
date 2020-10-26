var express = require("express");
var router = express.Router();

// User model
const User = require("../models/User.model");

// Bcrypt para encriptar passwords

const bcrypt = require("bcryptjs");

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.post("/signup", async (req, res, next) => {
  // validamos los datos que vienen del formulario
  if (req.body.email === "" || req.body.password === "") {
    res.render("signup", {
      errorMessage: "Username and password are a must for autenticate.",
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
      res.render("signup", {
        errorMessage: "The email already exists! Please, use another email.",
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
  res.render("login");
});

router.post("/login", async (req, res, next) => {
  // validamos los datos que vienen del formulario
  if (req.body.email === "" || req.body.password === "") {
    res.render("login", {
      errorMessage: "Username and password are needed for login. Please, make sure you provide them.",
    });
    return;
  }

  const { email, password } = req.body;

  try {
    // validar si el usuario existe en la BD
    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) {
      res.render("login", {
        errorMessage: "The email doesn't exist",
      });
      return;
    }

    if (bcrypt.compareSync(password, user.password)) {
      // guardar el usuario en la session
      //console.log("I'm before /");
      console.log("Before / - user", user);
      req.session.currentUser = user;
      console.log("Before / - 2nd user", user);
      console.log("Before / - req session:", req.session.currentUser);
      res.redirect("/");
    } else {
      res.render("login", {
        errorMessage: "Incorrect password",
      });
    }

    // validar si el password es correcto
  } catch (error) {}
});



router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login')
  })
})

module.exports = router;
