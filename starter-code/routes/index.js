const express = require('express');
const router = express.Router();
const Users = require("../models/User");
const bcrypt = require('bcrypt')
const fetch = require("node-fetch");
let giphyAPI = `https://api.giphy.com/v1/gifs/search?api_key=QXNIebQ1x1wdZNejp0rZVwgz7bw1DokB&q=mic drop&limit=50&offset=0&rating=G&lang=en`


function setViewResponse(page, title, subtitle, link, linkName,message, alternative, action, style) {
  return {
    page,
    title,
    subtitle,
    link,
    linkName,
    message,
    alternative,
    action,
    style
  };
}

// Signin route
router.get('/', (req, res, next) => {
  res.render('signup');
});


// Signin write
router.post("/", (req, res) => {
  const saltRounds = 10;
  const plainPassword1 = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainPassword1, salt);


  Users.findOne({ username: req.body.username })
    .then(userFound => {
      if (userFound !== null) {
        res.render('result', setViewResponse(
          "signup",
          "Signup",
          "Already have an account",
          "login",
          "Log in",
          "Ooops. Username already exists. ",
          "Try Again?",
          "/",
          "is-primary"
        ))
      }
      else {
        Users.create({ username: req.body.username, password: hash })
          .then((userCreated) => {
            res.render('result', setViewResponse(
              "signup",
              "Signup",
              "Already have an account",
              "login",
              "Log in",
              "User successfully created! ",
              "Log in",
              "/login",
              "is-primary"
            ))
          })
          .catch(() => {
            res.render('result', setViewResponse(
              "signup",
              "Signup",
              "Already have an account",
              "login",
              "Log in",
              "Something went wrong. ",
              "Try again",
              "/",
              "is-primary"
            ))
          });
      }
    });

});

// Login route
router.get('/login', (req, res, next) => {
  res.render('login');
});

//Login access
router.post('/login', (req, res) => {
  Users.findOne({ username: req.body.username })
    .then(user => {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.currentUser = user._id;
        res.redirect('main/?user=' + user.username)
      }
    })
    .catch(userNotFoundError => {
      res.render('result', setViewResponse(
        "login",
        "Login",
        "Are you not registered?",
        "/",
        "Sign up",
        "Username not found. ",
        "Try again",
        "/login",
        "is-info"
      ))
    });
})

//Main
router.get('/main', (req, res) => {
  if (req.session.currentUser) {

    let username = req.query.user;

    fetch(giphyAPI)
      .then(response => {
        return response.json();
      })
      .then(json => {
        let data = json.data;

        res.render('main', { username, data });

      })
      .catch(err => console.log(err));





  } else {
    res.redirect("/login");
  }

})

//Log out
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});



module.exports = router;
