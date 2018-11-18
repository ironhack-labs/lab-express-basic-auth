const express = require("express");
const session = require("express-session");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const MongoStore = require("connect-mongo")(session);//registro de sesiones
const mongoose = require("mongoose")
const genericUser = new User();

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
      res.redirect("/login");
    });
  }
});

router.get("/login", (req, res, next) => {
  res.render("login");
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

  User.findOne({ user: user })
  .then(user => {
      // if (!user) {
      //   res.render("login", {
      //     errorMessage: "The username doesn't exist"
      //   });
      //   return;
      // }
      if (bcrypt.compareSync(password, user.password)) {
        console.log('Hay match')
        req.session.inSession = true;
        req.session.currentUser = user;
        res.redirect("/main");
      } else {
        res.session.inSession = false;
        res.redirect('/')
        // res.render("login", {
        //   errorMessage: "Incorrect password"
        // });
      }
  })
  .catch(error => {
    next(error)
  })
});

router.get('/main', function (req, res) {
  if (req.session.inSession) {
    let sessionData = {
      ...req.session
    }
    res.render('main', {
      sessionData
    })
  } else {
    res.render('404')
  }
})

router.get('/private', function (req, res) {
  if (req.session.inSession) {
    let sessionData = {
      ...req.session
    }
    res.render('private', {
      sessionData
    })
  } else {
    res.render('404')
  }
})

module.exports = router;
