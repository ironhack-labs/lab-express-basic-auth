// importamos y ejecutamos express para traernos las rutas

const router = require("express").Router();

//importar el modelo(s) a utilizar
const User = require("../models/User.model");

//importar bcryptjs
const bcryptjs = require("bcryptjs");
const { removeListener } = require("../app");

//SIGNUP
router.get("/signup", (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect("/auth/profile");
  }
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { role, ...restUser } = req.body;
  const salt = bcryptjs.genSaltSync(12);
  const newPassword = bcryptjs.hashSync(restUser.password, salt);

  User.create({ ...restUser, password: newPassword })
    .then((user) => {
      console.log("el usuario creado", user);
      res.redirect(`/auth/profile/${user._id}`);
    })
    .catch((error) => {
      console.log("error en sign up", error);
      next();
    });
});

//LOGIN
router.get("/login", (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect("/auth/profile");
  }
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
      }
      if (bcryptjs.compareSync(password, user.password)) {
        return res.redirect(`/auth/profile/${user._id}`);
      } else {
        res.send("user or password incorrect");
      }
      req.session.currentUser = user;
      res.redirect("/auth/profile");
    })

    .catch((error) => {
      console.log("error en sign up", error);
      next();
    });
});

//Profile
router.get("/profile/:id", (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      res.render("user/profile", user);
    })
    .catch((error) => {
      console.log("error en profile", error);
      next();
    });
});

//Logout
router.get("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    }
    res.redirect("/auth/login");
  });
});

//Export routes
module.exports = router;
