var express = require("express");
var router = express.Router();

// User model
const User = require("../models/User.model");

// Bcrypt para encriptar passwords

const bcrypt = require("bcryptjs");

router.get("/signup", function (req, res, next) {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  // validamos los datos que vienen del formulario
  if (req.body.email === "" || req.body.password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up",
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
    //console.log(`${JSON.stringify(user)}`);   
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The email already exists!",
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

//route to access the login page.
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});


//add the POST method to handle the form request. This request will authenticate the user if the username and passwords are correct:
router.post("/login", async (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  // validamos los datos que vienen del formulario
  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
    .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }

      if (bcrypt.compareSync(thePassword, user.password)) {

        // guardar el usuario en la session
        //we create the user session; the request object has a property called session where we can add the values we want to store on it. In this case, we are setting it up with the user’s information.
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password",
        });
      }
    })
    // validar si el password es correcto
    .catch(error => {
      next(error);
    })
});


router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login')
  })
})

module.exports = router;
