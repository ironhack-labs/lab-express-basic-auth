const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const bcrypt = require("bcryptjs");

router.get("/signin", (req, res) => {
    res.render("auth/signin");
  });

  router.get("/signup", (req, res) => {
    res.render("auth/signup", { js: ["signup"] });
  });

  router.post("/signup", (req, res, next) => {
    const user = req.body; // req.body contains the submited informations (out of post request)
    
    // if (req.file) user.avatar = req.file.secure_url;
  
    if (!user.username || !user.password) {
      res.redirect("/auth/signup");
      return;
    } else {


      userModel
        .findOne({ username: user.username })
        .then(dbRes => {
          if (dbRes) return res.redirect("/auth/signup"); //
  
          const salt = bcrypt.genSaltSync(10); // https://en.wikipedia.org/wiki/Salt_(cryptography)
          const hashed = bcrypt.hashSync(user.password, salt); // generates a secured random hashed password
          user.password = hashed; // new user is ready for db
  
          userModel
            .create(user)
            .then(() => res.redirect("/auth/signin"))
            // .catch(dbErr => console.log(dbErr));
        })
        .catch(next);
    }
  });




  router.post("/signin", (req, res, next) => {
    const user = req.body;
  
    if (!user.username || !user.password) {
      // one or more field is missing
      
      return res.redirect("/auth/signin");
    }
  
    userModel
      .findOne({ username: user.username })
      .then(dbRes => {
        if (!dbRes) {
          // no user found with this email
          return res.redirect("/auth/signin");
        }
        // user has been found in DB !
        if (bcrypt.compareSync(user.password, dbRes.password)) {
          // encryption says : password match success
          console.log("hey");
          
          const { _doc: clone } = { ...dbRes }; // make a clone of db user
          

          delete clone.password; // remove password from clone
          // console.log(clone);
          
          req.session.currentUser = clone; // user is now in session... until session.destroy
          return res.redirect("/");
        } else {
          // encrypted password match failed
          return res.redirect("/auth/signin");
        }
      })
      .catch(next);
  });


  module.exports = router;