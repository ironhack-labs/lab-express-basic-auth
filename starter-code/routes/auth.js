const express = require('express');
const router  = express.Router();

const User = require('../models/User');

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('auth/login');
});

router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
    const { username, password } = req.body;
  
    // validamos si los valores de los inputs llegan vacíos
  
    if (username === "" || password === "") {
        return res.render("auth/signup", {
            errorMessage: "Indicate a username and a password to sign up"
        });
      
    }
  
    //busco en la BD si existe el username
  
     const userObject = await User.findOne({ username: username })
        if (userObject !== null) {
            return res.render("auth/signup", {
                errorMessage: "The username already exists!"
            });
        } else {
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);
            await User.create({ username, password: hashPass });
            return res.redirect("/");
        }
});

router.get("/login", (req, res, next) => {
    res.render("auth/login");
});
  
router.post("/login", async (req, res, next) => {
    //asignamos a variables los datos que vienen del form
    const theUsername = req.body.username;
    const thePassword = req.body.password;
  
    //verificamos que los valores del form no lleguen vacíos
    if (theUsername === "" || thePassword === "") {
      res.render("auth/login", {
        errorMessage: "Please enter both, username and password to sign up."
      });
      return;
    }
  
    // buscamos en la BD si existe un username con los datos del user que vienen del form
    // si no lo encuentra, nos dice que el user no existe
    // sino, nos devuelve el user
    // usamos el método compareSync para hacer hash del form input y compararlo con el password guardado en la BD
  
    const userObject = await User.findOne({ username: theUsername })
        
        if (!userObject) {
          return res.render("auth/login", {
            errorMessage: "The username doesn't exist."
          });
          
        }
        if (bcrypt.compareSync(thePassword, userObject.password)) {
          // Save the login in the session!
          //the request object has a property called session where we can add the values we want to store on it. In this case, we are setting it up with the user’s information.
          req.session.currentUser = userObject;
          res.redirect("/user/main");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
})
      
      


module.exports = router;