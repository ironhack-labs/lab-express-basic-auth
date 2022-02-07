const router = require("express").Router();
const bcryptjs = require("bcryptjs");

const User = require("./../models/User.model");
const saltRounds = 10;

//Signup

router.get("/registro", (req, res, next) => res.render("auth/signup-form"));

router.post("/registro", (req, res, next) => {
  const { username, email, userPwd } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(userPwd, salt))
    .then((hashedPassword) => {
      console.log("Hash a crear en la base de datos es", hashedPassword);
      return User.create({ username, email, passwordHash: hashedPassword });
    })
    .then((createdUser) => {
      req.session.currentUser = createdUser;
      console.log("Objeto de express-session", req.session);
      res.redirect("/perfil");
    })
    .catch((error) => console.log(err));
});

//Login

router.get("/inicio-sesion", (req, res, next) => res.render("auth/login-form"));

router.post("/inicio-sesion", (req, res, next) => {
  const { username, userPwd } = req.body;

  if (username.length === 0 || userPwd.length === 0) {
    res.render("auth/login-form", {
      errorMessage: "Por favor, rellena todos los campos",
    });
    return;
  }

  User.findOne({ username }).then((user) => {
    if (!user) {
      res.render("auth/login-form", {
        errorMessage: "Email no registrado en la Base de Datos",
      });
      return;
    } else if (bcryptjs.compareSync(userPwd, user.passwordHash) === false) {
      res.render("auth/login-form", {
        errorMessage: "La contraseña es incorrecta",
      });
      return;
    } else {
      req.session.currentUser = user;
      console.log("Objeto de express-session", req.session);
      res.redirect("/perfil");
    }
  });
});

// Logout
router.post("/cerrar-sesion", (req, res) => {
  req.session.destroy(() => res.redirect("/inicio-sesion"));
});

module.exports = router;
