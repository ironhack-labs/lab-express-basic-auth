const express = require('express');
const router  = express.Router();

const protectRoute = require("../middlewares/protectRoute");

const userModel = require("../models/User");
const bcrypt = require("bcryptjs"); // intro to bcrypt hashing algorithm https://www.youtube.com/watch?v=O6cmuiTBZVs

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/signup", (req, res) => {
  res.render("auth/signup", { js: ["signup"] });
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/jysuis", (req, res) => {
  res.render("jysuis");
});

/*
router.get("/dashboard", protectRoute, (req, res) => {
  res.render("dashboard");
});

router.get("/admin", protectAdminRoute, (req, res) => {
  res.render("admin");
});
*/

router.get("/main", protectRoute, (req, res) => {
  res.render("main");
});


router.get("/private", protectRoute, (req, res) => {
  res.render("private");
});



router.post("/signup", (req, res, next) => {
  const user = req.body; 
  console.log(user, "signup");
 if (!user.email || !user.password) {
    req.flash( "error", "do it again /auth/signup");
    res.redirect("/signup");
    return;
  } else {
    userModel
      .findOne({ email: user.email })
      .then(dbRes => {
        if (dbRes) { 
            req.flash( "error", "do it again /signup");
            return res.redirect("/signup"); //
        }    
        const salt = bcrypt.genSaltSync(10); // https://en.wikipedia.org/wiki/Salt_(cryptography)
        const hashed = bcrypt.hashSync(user.password, salt); // generates a secured random hashed password
        user.password = hashed; // new user is ready for db
        userModel
          .create(user)
          .then(() => res.redirect("/login"))
          //.catch(dbErr => console.log(dbErr));
      })
      .catch(next);
  }
});

router.post("/login", (req, res) => {
  const user = req.body; 
 if (!user.email || !user.password) {
    // one or more field is missing
    req.flash("error", "wrong credentials");
    return res.redirect("/auth/signin");
  }

  userModel
    .findOne({ email: user.email })
    .then(dbRes => {
      if (!dbRes) {
        // no user found with this email
        req.flash("error", "c'est pas bon");
        return res.redirect("/login");
      }
      // user has been found in DB !
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        // encryption says : password match success
        const { _doc: clone } = { ...dbRes }; // make a clone of db user
        delete clone.password; // remove password from clone
   
        req.session.currentUser = clone; // user is now in session... until session.destroy
        return res.redirect("/jysuis");
      } else {
        // encrypted password match failed
        return res.redirect("/login");
      }
    })
    .catch(next);
});



module.exports = router;
