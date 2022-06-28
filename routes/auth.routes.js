const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const isLoggedIn = require("../middleware/isLoggedIn")

const isLoggedOut = require("../middleware/isLoggedOut");



router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {

  if (req.session.currentUser) {
    return res.redirect(`/auth/profile/${req.session.currentUser._id}`);
  }

  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { role, ...restUser } = req.body;
console.log("YO SOY EL REST USER ", restUser)
const { username, email, password } = req.body;


if (!email) {
  console.log("lo vi, no hay email")
  return res.status(400).render("auth/signup", {
    serrorMessage: "Please provide your email.",
  });
}

if (password.length < 8) {
  return res.status(400).render("auth/signup", {
    serrorMessage: "Your password needs to be at least 8 characters long.",
  });
}


// Search the database for a user with the email submitted in the form
User.findOne({email}).then((found) => {
  // If the user is found, send the message email is taken
  if (found) {
    return res
      .status(400)
      .render("auth/signup", { serrorMessage: "email already taken." });
  }})

  User.findOne({username}).then((found) => {
    // If the user is found, send the message email is taken
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { serrorMessage: "username already taken." });
    }})


  const salt = bcryptjs.genSaltSync(12);
  const newPassword = bcryptjs.hashSync(restUser.password, salt);

  User.create({ ...restUser, password: newPassword })
    .then((user) => {
      req.session.currentUser = user;
      //console.log("la session!: ", req.session); // le metemos el user al req.session. currentUser tiene toda la info del user.
      res.redirect(`/auth/profile/${user._id}`);
    })
    .catch((error) => {
      console.log("Error creando usuario", error);
      next();
    });
});

//iteración 2

router.get("/login",(req, res, next) => {

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
      
      
      if (!user) {
        const errorMessage = ["Tienes que agregar un user"];
        return res.render("auth/login", { errorMessage });
      }

      if (bcryptjs.compareSync(password, user.password)) {
        res.redirect(`/auth/profile/${user._id}`);
      } else {
        const errorMessage = ["No es la contraseña"];
        return res.render("auth/login", { errorMessage });
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

  console.log("estoy logeado ", req.session.currentUser);

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



router.get("/profile/:id/private", isLoggedIn, (req, res, next) => {

  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      res.render("user/private", user);
    })
    .catch((err) => {
      console.log(err);
      next();
    })

})

module.exports = router;
