const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Users = require("../models/User");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);


router.use(
  session({
    saveUninitialized: true,
    resave: true,
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

/* GET home page */

router.get('/', (req, res, next) => {
  res.render('login');
});

router.get("/private", (req, res) => {
  if (req.session.currentUser) {
    Users.findById(req.session.currentUser).then((allUserData) => {
      res.render("private", {
        user: allUserData
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/main", (req, res) => {
  if (req.session.currentUser) {
    Users.findById(req.session.currentUser).then((allUserData) => {
      res.render("main", {
        user: allUserData
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/create-user', (req, res, next) => {
  if (req.body.username.trim() === '' || req.body.password.trim() === '') {
    res.json({
      msg: 'username o psw are empty'
    });
    return;
  }

  Users.findOne({ username: req.body.username }).then((foundUser) => {
    if (foundUser) {
      res.json({
        msg: 'username already taken'
      });

      return;
    } else {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(req.body.password, salt);

      Users.create({
        username: req.body.username,
        password: hash
      }).then(() => {
        res.json({
          msg: 'user already created'
        })
      })
    }
  });
});

router.post('/login', (req, res, next) => {

  if (req.body.username === '' || req.body.password === '') {
    res.render('login', { errorMessage: 'user or password are empty' })
    return;
  }

  Users.findOne({username: req.body.username})
  .then(user => {
    if(!user) {
      res.render('login', {
        errorMessage: 'The username doesn´t exist'
      });
      return;
    }
    if (bcrypt.compareSync(req.body.password, user.password)){
      req.session.currentUser = user._id;
      res.redirect('/private');
    } else {
      res.render('login', {
        errorMessage: 'Incorrect password'
      })
    }
  })


});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login')
  })
})


module.exports = router;
