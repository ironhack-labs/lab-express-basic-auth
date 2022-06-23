const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {

  if (req.session.currentUser) {
    return res.redirect(`/auth/profile/${req.session.currentUser._id}`);
  }

console.log("existo? ", req.session.currentUser)

  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { role, ...restUser } = req.body;

  const salt = bcryptjs.genSaltSync(12);
  const newPassword = bcryptjs.hashSync(restUser.password, salt);

  User.create({ ...restUser, password: newPassword })
    .then((user) => {
      req.session.currentUser = user;
      console.log("la session!: ", req.session); // le metemos el user al req.session. currentUser tiene toda la info del user.

      res.redirect(`/auth/profile/${user._id}`);
    })
    .catch((error) => {
      console.log("Error creando usuario", error);
      next();
    });
});

//iteración 2

router.get("/login", (req, res, next) => {

  if (req.session.currentUser) {
    return res.redirect(`/auth/profile/${req.session.currentUser._id}`);
  }

  res.render("auth/login");
});


//me logeo:

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username }) //findOne es para las condiciones
    .then((user) => {
       // el usuario es un objeto

      req.session.currentUser = user;
      console.log("la session!: ", req.session);
      
      if (!user) {
        const errorMessage = ["el correo o contraseña es incorrecta"];
        return res.render("auth/signup", { errorMessage });
      }

      if (bcryptjs.compareSync(password, user.password)) {
        res.redirect(`/auth/profile/${user._id}`);
      } else {
        res.send("no es la contrasen1a o username, bro");
      }
    })
    .catch((err) => {
      console.log("un error buscando el usuario", err);
      next();
    });
});

router.get("/profile/:id", (req, res, next) => {

if (!req.session.currentUser) {
    return res.render("auth/notauth");
  }

  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      res.render("user/profile", user);
    })
    .catch((err) => {
      console.log(err);
      next();
    });
});

module.exports = router;
