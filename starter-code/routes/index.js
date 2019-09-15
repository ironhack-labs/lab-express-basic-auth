const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Users = require("./../models/Users");
const messageCodes = require("./../messageCodes.json");

const isUserLoggedIn = (req) => req.session.user

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {
    userLoggedIn: isUserLoggedIn(req)
  });
});

// Route to render the login screen
router.get("/login", (req, res) => {
  // If the user is logged in and tries to login again,
  // redirect to the index
  if (isUserLoggedIn(req)) {
    res.redirect('/')
    return
  }

  if (!req.query.code) res.render("login");
  else {
    res.render("login", {
      code: messageCodes[req.query.code]
    })
  }
});

// Route to handle the login request
router.post("/login", (req, res) => {
  // Save the username and the password provided
  const username = req.body.username
  const password = req.body.password

  // Get the hashed password stored in MongoDB
  Users.findOne({username: username}).then(userFound => {
    if (userFound === null) {
      // The user does not exists
      res.redirect('/login?code=4')
      return
    }

    const hashedPassword = userFound.password;
    
    if (bcrypt.compareSync(password, hashedPassword)) {
      // Password matches
      req.session.user = userFound._id
      console.log(userFound._id, "Olé")
      res.redirect("/profile")
      return
    } else {
      // Password does not match
      res.redirect('/login?code=4')
      return
    }
  })
});

// Route to render the handlebar that paints the signup screen
router.get("/signup", (req, res) => {
  // If there is no error, we render the login normally
  if (!req.query.code) res.render("signup");
  else {
    // If there is a error, we send it to the signup view
    res.render("signup", {
      code: messageCodes[`${req.query.code}`]
    });
  }
});

// Route to handle the signup request
// In any case, we will redirect to a route and pass a
// parameter so we can handle the response
router.post("/signup", (req, res) => {
  // Save the data from the form
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;

  // Check if the fields are OK
  if (
    username.trim().length === 0 ||
    password.trim().length === 0 ||
    name.trim().length === 0
  ) {
    // Any of the fields are incorrect
    res.redirect("/signup?code=1");
    return
  }

  // Check if the user already exists.
  Users.findOne({ username: username }).then(userFound => {
    // User found
    if (userFound !== null) {
      res.redirect("/signup?code=2");
      return
    }

    // At this points, we have ensure that the user is not created
    // We can now add the new user to the database

    // Encrypt the password
    const saltRounds = 12;
    const salt = bcrypt.genSaltSync(saltRounds);
    const encryptedPassword = bcrypt.hashSync(password, salt);

    Users.create({
      username: username,
      password: encryptedPassword,
      name: name
    }).then(userCreated => {
      // The user was created successfully
      res.redirect("/login?code=3");
      return
    });
  });
});


// Private zone
router.get('/profile', (req, res) => {
  // Check if the user is logged in
  if (!req.session.user) {
    // The user is not logged in
    res.redirect('/')
    return
  }


  // Find the user in the database so we can send the name
  Users.findById(req.session.user).then(userFound => {
    res.render('private/profile', {
      userLoggedIn: userFound
    })
  })
})


// Logout
router.get('/logout', (req, res) => {
  const userLoggedIn = isUserLoggedIn(req)

  // Only destroy the session when the user is logged in
  if (userLoggedIn) {
    req.session.destroy(error => {
      res.redirect('/')
      return
    })
  }
})

module.exports = router;
