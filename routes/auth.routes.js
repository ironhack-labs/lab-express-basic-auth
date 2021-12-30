const router = require('express').Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');
const Upload = require('../helper/multer');
const mongoose = require('mongoose');

// Signup
router.get("/signup", (req, res) => res.render("auth/signup"));

router.post('/signup', (req, res, next) => {
    const { name, password, email } = req.body;

    if (!name || !password || !email) {
        res.render('auth/signup', {
            errorMessage:
              "All fields are mandatory! Please provide your name, email and password."
        });
        return;
    };

    User.findOne({ email })
        .then(user => {
            if(user) {
                res.status(500).render("auth/signup", {
                  errorMessage:
                    "This email has already been registered. Please, try a new one.",
                });
                return;
            } else {
                const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}/;
                if (!regex.test(password)) {
                  res.status(500).render("auth/signup", {
                    errorMessage:
                      "Password must be at least 4 characters and contain at least one number, one lowercase and one uppercase letter.",
                  });
                  return;
                }

                bcryptjs
                  .genSalt(saltRounds)
                  .then((salt) => bcryptjs.hash(password, salt))
                  .then((hashedPassword) => {
                    let usernameCreate = email
                      .replace(".com", "")
                      .replace("@", "");
                    return User.create({
                      name,
                      email,
                      username: usernameCreate,
                      passwordHash: hashedPassword,
                    });
                  })
                  .then((userFromDB) => res.redirect("/userProfile"))
                  .catch((err) => {
                    if (err instanceof mongoose.Error.ValidationError) {
                      res
                        .status(500)
                        .render("auth/signup", { errorMessage: err.message });
                    } else if (err.code === 11000) {
                      res.status(500).render("auth/signup", {
                        errorMessage:
                          "This email has already been registered. Please, try a new one.",
                      });
                      return;
                    } else {
                      next(err);
                    }
                  });
            }
        });
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (email === "" || password === "") {
        res.render('auth/login', {
            errorMessage:
              "Please enter both, email and password to login."
        });
        return;
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login', {
                    errorMessage:
                      "Email not registered. Try again with a different email or sign up."
                });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                req.session.currentUser = user;
                res.redirect('/userProfile');
            } else {
                res.render('auth/login', {
                    errorMessage:
                      "Incorrect password."
                });
                return;
            }
        })
        .catch(err => next(err));
});

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/');
    })
});

// User profile
router.get('/userProfile', isLoggedIn, (req, res) => 
    res.render('users/user-profile', { userInSession: req.session.currentUser })
);

router.get('/user-profile-edit', isLoggedIn, (req, res, next) => {
    res.render('users/user-profile-edit', { userInSession: req.session.currentUser })
});

router.post("/user-profile-edit/:userId", Upload.single("profilePicture"), (req, res, next) => {

    const { name, username, profilePicture } = req.body;
    const { userId } = req.params;
    let picture;

    if(req.file) {
        picture = req.file.path;

        User.findByIdAndUpdate(
          userId,
          { username, profilePicture: picture },
          { new: true }
        )
          .then((user) => {
            req.session.currentUser = user;
            res.redirect("/userProfile");
          })
          .catch((err) => next(err));
    } else {
        User.findByIdAndUpdate(
          userId,
          { name, username },
          { new: true }
        )
          .then((user) => {
            req.session.currentUser = user;
            res.redirect("/userProfile");
          })
          .catch((err) => next(err));
    }
});

router.get("/main", isLoggedIn, (req, res) =>
  res.render("users/user-main", { userInSession: req.session.currentUser })
);

router.get("/private", isLoggedIn, (req, res) =>
  res.render("users/user-private", { userInSession: req.session.currentUser })
);

module.exports = router;