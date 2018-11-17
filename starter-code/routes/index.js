const express = require("express");
const session = require("express-session");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const MongoStore = require("connect-mongo")(session);//registro de sesiones
const mongoose = require("mongoose")
const genericUser = new User();
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.use(session({
	secret: "basic-auth-secret",
	cookie: {
		maxAge: 60000
	},
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		ttl: 24 * 60 * 60 // 1 day
	})
}));

router.post("/", (req, res, next) => {
  const saltRounds = 6;

  genericUser.user = req.body.user;
  
  if (req.body.user === "" || req.body.password === "") {
    console.log("error vacio");
  } else {
    
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);
    genericUser.password = hash;
  
    genericUser.save().then(user => {
      req.session.inSession = true
      res.render("main", { user: user.user });
    });
  }
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.post("/login", (req, res, next) => {
  const user = req.body.user;
  const password = req.body.password;

  if (user === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "user": user })
  .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/main");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error)
  })
});

module.exports = router;
