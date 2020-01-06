const express = require('express');
const router  = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// home page
router.get('/', (req, res, next) => {
  res.render('index');
});

// signup page
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
})

// signup POST (user create)
router.post("/signup", (req, res, next) => {
  const {username, password} = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "The fields can't be empty"
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user => {
    if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "Username already in use"
        });
        return;
      }
  
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
  
      User.create({
        username,
        password: hashPass
      })
      .then(() => {
        // aqui quis adicionar uma mensagem. o contra desse método é que a url permanece /signup
        res.render("index", {message: "Account created!"});
      })
      .catch(error => {
        console.log(error);
      })
  })
  .catch(error => {
    next(error);
  })
});

// login page
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

// login POST (user login)
router.post("/login", (req, res, next) => {
  const {username, password} = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both username and password to log in"
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "User doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});

//logout
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});

// restricted routes
router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/private", (req, res, next) => {
  res.render("private");
});

module.exports = router;
