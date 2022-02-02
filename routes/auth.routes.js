const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const { loggedIn, loggedOut } = require('../middleware/route-protection.js');
const User = require('../models/User.model');
const saltRounds = 10;

router.get('/signup', (req, res) => res.render('authentication/signup'));

router.post('/signup', (req, res, next) => {
    console.log("The form data: ", req.body);
   
    const { username, password } = req.body;
   
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          username,
          password: hashedPassword
        });
      })
      .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
        res.redirect('/');
      })
      .catch(error => next(error));
  });

  router.get('/login', (req, res) => res.render('authentication/login'));

  router.post("/login", (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const { username, password } = req.body;
  
    if (username === "" || password === "") {
      res.render("authentication/login", {
        errorMessage: "Please enter both, email and password to login.",
      });
      return;
    }
  
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          res.render("authentication/login", {
            errorMessage: "Username is not registered. Try with other email.",
          });
          return;
        } else if (bcryptjs.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.redirect('/userProfile');
        } else {
          res.render("authentication/login", { errorMessage: "Incorrect password." });
        }
      })
      .catch((error) => next(error));
  });
  
  router.get("/userProfile", (req, res) => res.render('user/profile', { userInSession: req.session.currentUser }));

  router.get("/main", loggedIn, (req, res) => res.render('main'));

  router.get("/private", loggedIn, (req, res) => res.render('private'));

  router.post('/logout', loggedIn, (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });

module.exports = router;