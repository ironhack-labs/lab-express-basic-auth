const bcrypt  = require("bcryptjs");
const express = require("express");
const router = express.Router();
const userModel = require("../models/User");

router.get("/signup", (req, res) => {
  res.render("auth/signup", { js: ["signup"] });
});

router.get("/signin", (req, res) => {
  res.render("auth/signin", {js : ["signin"]});
})


// registering (sign up)

router.post("/signup", (req, res, next) => {
  const user = req.body; 

  if (!user.email || !user.password) {
    res.redirect("/auth/signup");
    return;
  } else {
    userModel
      .findOne({ email: user.email })
      .then(dbRes => {
        if (dbRes) return res.redirect("/auth/signup"); 

        const salt = bcrypt.genSaltSync(10); 
        const hashed = bcrypt.hashSync(user.password, salt); 
        user.password = hashed; 

        userModel
          .create(user)
          .then(() => res.redirect("/auth/signin"))
      })
      .catch(next);
  }
});



router.post("/signin", (req, res, next) => {
  const user = req.body;

  if (!user.email || !user.password) {
    req.flash("error", "wrong credentials");
    return res.redirect("/auth/signin");
  }

  userModel
    .findOne({ email: user.email })
    .then(dbRes => {
      if (!dbRes) {
        req.flash("error", "wrong credentials");
        return res.redirect("/auth/signin");
      }
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        const { _doc: clone } = { ...dbRes }; 
        delete clone.password; 
        req.session.currentUser = clone; 
        return res.redirect("/dashboard");
      } else {
        return res.redirect("/auth/signin");
      }
    })
    .catch(next);
});


module.exports = router;