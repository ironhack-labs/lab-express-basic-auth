const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require('bcryptjs');
const bcryptSalt = 10;


/*SIGN UP*/
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    if ( username === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "You need to give a username and a password to Sign Up",
        })
        return;
    }

    User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "This User already exists",
        });
        return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({ username, password: hashPass })
        .then(() => {
          res.redirect("/");
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      next(error);
    });
})

/*LOG IN*/
router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

router.post("/login", (req, res, next) => {
    const { username, password } = req.body;

    if ( username === "" || password === "") {
        res.render("auth/login", {
            errorMessage: "Please enter both username and password to login",
        })
        return;
    }

    User.findOne({ username })
    .then((user) => {
      if(!user) {
          res.render("auth/login", {
              errorMessage: "This user doesn't exist"
          });
          return;
      }

    if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/')
    } else {
        res.render('auth/login', {
            errorMessage: "Password is not correct"
        })
    }
})
    .catch((error) => {
        next(error);
    })
});

router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      // si no puede acceder a los datos de sesión, redirige a /login
      res.redirect("/login");
    });
});

module.exports = router;

