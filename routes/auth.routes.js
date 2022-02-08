const router = require("express").Router();

//encryptation
const bcryptjs = require("bcryptjs");

//registro en BD

const User = require("./../models/User.model");

// registro

router.get("/registro", (req, res, next) => {
  res.render("./auth/signup");
});

router.post("/registro", (req, res, next) => {
  const { username, email, userPwd } = req.body;

  if (username.length === 0 || email.length === 0 || userPwd.length === 0) {
    res.render("./auth/signup", {
      errorMessage: "Por favor, rellene todos los campos",
    });
  }

  const salt = bcryptjs.genSaltSync(10);
  const hashedPassword = bcryptjs.hashSync(userPwd, salt);

  User.create({ username, email, passwordHash: hashedPassword })
    .then(() => res.redirect("/"))
    .catch((error) => next(error));
});

// inicio de sesion

router.get("/inicio-sesion", (req, res, next) => {
  res.render("./auth/login");
});

router.post("/inicio-sesion", (req, res, next) => {
  const { email, userPwd } = req.body;

  if (email.length === 0 || userPwd.length === 0) {
    res.render("auth/login", {
      errorMessage: "Por favor, rellene todos los campos",
    });
    return;
  }

  User.findOne({ email }).then((user) => {
    if (!user) {
      res.render("auth/login", {
        errorMessage: "Email no registrado",
      });
      return;
    } else if (bcryptjs.compareSync(userPwd, user.passwordHash) === false) {
      res.render("auth/login", {
        errorMessage: "La contraseña es incorrecta",
      });
      return;
    } else {
      req.session.currentUser = user;
      console.log("El objeto de EXPRESS-SESSION", req.session);
      res.redirect("/perfil");
    }
  });
});

//exports
module.exports = router;
