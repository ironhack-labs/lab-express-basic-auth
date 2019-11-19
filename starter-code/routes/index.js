const express = require("express");
const router = express.Router();


// to be able to use login file from any route
const loginRoute = require("./login");

const logoutRoute = require("./logout");

const signupRoute = require("./signup");


router.use("/login", loginRoute);

router.use("/logout", logoutRoute);

// La ruta a la que llama /signup
router.use("/signup", signupRoute);


// Aqui pongo el path secret localhost:3000/secret
router.get("/secret", (req, res, next) => {
  res.render("secret");
});

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
