const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const bcrypt = require("bcrypt"); 
const uploader = require("./../config/cloudinary");

// form views 

router.get("/signup", protectRoute,(req, res) => {
  res.render("auth/signup", { js: ["signup"] });
});``

router.get("/signin", protectRoute,(req, res) => {
  res.render("auth/signin");
});




// action::Registering

router.post("/signup", protectRoute, (req, res, next) => {
  const user = req.body; // req.body contains the submited informations (out of post request)


  if (!user.username || !user.password) {
    res.redirect("/auth/signup");
    return;
  } else {
    userModel
      .findOne({ username: user.username })
      .then(dbRes => {
        if (dbRes) return res.redirect("/auth/signup"); 

        const salt = bcrypt.genSaltSync(10); 
        const hashed = bcrypt.hashSync(user.password, salt); 
        user.password = hashed; 

        userModel
          .create(user)
          .then(() => res.redirect("/auth/signin"))
          // .catch(dbErr => console.log(dbErr));
      })
      .catch(next);
  }
});

// action::Login

router.post("/signin", protectRoute,(req, res, next) => {
  const user = req.body;

  if (!user.username || !user.password) {
    // one or more field is missing
    req.flash("error", "wrong credentials");
    return res.redirect("/auth/signin");
  }

  userModel
    .findOne({ username: user.username })
    .then(dbRes => {
      if (!dbRes) {
        // no user found with this username
        req.flash("error", "wrong credentials");
        return res.redirect("/auth/signin");
      }
      // user has been found in DB !
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        // encryption says : password match success
        const { _doc: clone } = { ...dbRes }; // make a clone of db user
        
        delete clone.password; // remove password from clone
        // console.log(clone);
        
        req.session.currentUser = clone; // user is now in session... until session.destroy
        return res.redirect("/dashboard");
      } else {
        // encrypted password match failed
        return res.redirect("/auth/signin");
      }
    })
    .catch(next);
});

// action::Logout

router.get("/signout", protectRoute, (req, res) => {
  req.session.destroy(() => {
    res.locals.isLoggedIn = undefined;
    res.locals.isAdmin = undefined;
    res.redirect("/auth/signin");
  });
});

module.exports = router;
