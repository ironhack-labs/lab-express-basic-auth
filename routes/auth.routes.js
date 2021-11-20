// routes/auth.routes.js
const mongoose = require("mongoose"); // <== has to be added
const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
// GET route ==> to display the signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));
// routes/auth.routes.js
// ... we won't make any changes, we will just add a new route
// (the order really) doesn't matter, but you can keep the logic signup => login => logout

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});


// POST route ==> to process form data

// routes/auth.routes.js
// ... the setup and the get route

// POST route ==> to process form data
// auth.routes.js
// the setup code skipped
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

// the get route skipped

// POST route ==> to process form data
router.post("/signup", (req, res, next) => {
  // console.log("The form data: ", req.body);

  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }
  
  //*************************************** */
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render("auth/signup", {
        errorMessage:
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
    return;
  }
  //************************************** */
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        // username: username
        username,
        email,
        // passwordHash => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.redirect("/userProfile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        next(error);
      }
    }); // close .catch()
});
//********************************************* */
router.get("/login", (req, res) => res.render("auth/login"));
//********************************************* */
// routes/auth.routes.js
// ... imports and both signup routes stay untouched

//////////// L O G I N ///////////

// GET login route stays unchanged

// POST login route ==> to process form data
router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //console.log("************************",{user})
        //res.render('users/user-profile', { user });

        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }

      
      
    })
    
    .catch((error) => next(error));
  });

  router.get("/userProfile", (req, res) => {
    console.log("req.session.currentUser****",req.session.currentUser);

    res.render("users/user-profile", {
      userInSession: req.session.currentUser,
    });
  });
// userProfile route and the module export stay unchanged

module.exports = router;
