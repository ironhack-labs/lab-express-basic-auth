const express = require('express');
const router = express.Router();
const Users = require("../models/User");
const bcrypt = require('bcrypt')
const fetch = require("node-fetch");
let giphyAPI = `https://api.giphy.com/v1/gifs/search?api_key=QXNIebQ1x1wdZNejp0rZVwgz7bw1DokB&q=mic drop&limit=50&offset=0&rating=G&lang=en`



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

  function signupResolve(message, alternative, action) {
    res.render('result', { message, alternative, action });
  }

  Users.findOne({ username: req.body.username })
    .then(userFound => {
      if (userFound !== null) {
        signupResolve("Ooops. Username already exists. ", "Try Again?", "/")
      }
      else {
        Users.create({ username: req.body.username, password: hash })
          .then(userCreated => {
            signupResolve("User successfully created! ", "Log in", "/login");
          })
          .catch(() => {
            signupResolve("Username or password invalid. ", "Try Again?", "/");
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
      res.json({ alert: userNotFoundError });
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
