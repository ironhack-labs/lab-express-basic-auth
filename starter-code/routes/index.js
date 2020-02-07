const express = require('express');
const router = express.Router();
const user = require('../models/user');
const bcrypt = require('bcrypt');


/* GET ROUTES */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/main', (req, res, next) => {
  if (req.session.currentUser) {
    
    res.render('main')
  } else {
    res.redirect('/login')
  }
});

router.get('/private', (req, res, next) => {
  if (req.session.currentUser) {
    
    res.render('private')
  } else {
    res.redirect('/login')
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

router.post("/login", (req, res) => {
  /*  function notFound(reason) {
     res.json({ authorised: false, reason });
   } */
  if (req.body.username === "" || req.body.password === "") {
    res.render("login", { error: "user or password are empty" })
    return;
  }
  user.findOne({ username: req.body.username })
    .then((userFound) => {
      // res.json({userFound})
      if (bcrypt.compareSync(req.body.password, userFound.password)) {
        //continue login
        req.session.currentUser = userFound._id;
        console.log(req.session.currentUser)
        res.redirect("/main");
        // res.json({ authorised: true });
      } else {
        // notFound("password or user are wrong");
        res.render("login", { error: "password is wrong" })
      }
    })
    .catch((userNotFoundError) => {
      res.render("login", { error: "user not found" })
    });
});


// SIGN UP //

router.post('/', (req, res, next) => {
  if (req.body.username.trim() === '' || req.body.password.trim() === '') {
    res.json({
      error: true,
      msg: "Username or password are empty"
    });

    return;
  }

  user.findOne({ username: req.body.username }).then((foundUser) => {
    if (foundUser) {
      res.json({
        error: true,
        msg: "Username already taken."
      });

      return;
    } else {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(req.body.password, salt);

      user.create({
        username: req.body.username,
        password: hash
      }).then(() => {
        res.json({
          userCreated: true,
          timestamp: new Date()
        });
      });
    }
  });
});








module.exports = router;

