const express = require('express');
const router  = express.Router();

// to be able to use auth file from any route
const authRoute = require("./auth");

// to be able to use login file from any route
const loginRoute = require("./login");


const logoutRoute = require("./logout");

const signupRoute = require("./signup");


router.use("/auth", authRoute);


router.use("/login", loginRoute);


router.use("/logout", logoutRoute);


        // La ruta a la que llama /signup
router.use("/signup", signupRoute);

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
