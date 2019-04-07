const express 	 = require("express");
const router 	 = express.Router();
// User model
const User 		 = require("../models/user");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

/* GET signup page */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

/* GET login page */
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

/* GET logout page */
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

/* POST signup method */
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  	if (username === "" || password === "") {
  		res.render("auth/signup", {
    		errorMessage: "Indicate a username and a password to sign up"
  		});
  		return;
    }

    if (!passwordRegex.test(password)){
      res.render("auth/signup", {
        errorMessage: "Password : at least 6 characters, 1 number, 1 lowercase and one uppercase letter"
      });
      return;
    }

  	User.findOne({ "username": username })
	   .then(user => {
  		if (user !== null) {
      		res.render("auth/signup", {
        	errorMessage: "The username already exists!"
      	});
      	return;
      }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({
      	username,
      	password: hashPass
    })
    .then(() => {
      	res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    })
	})
	.catch(error => {
  		next(error);
	})

});

/* POST login method */
router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
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

module.exports = router;