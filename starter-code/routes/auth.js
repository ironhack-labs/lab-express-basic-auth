const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");



router.post("/signup", (req,res,next)=>{
  const user = req.body;
  if (!user.username || !user.password) {
    res.render("auth/signup", { errorMsg: "All fields are required." });
    return;
  } else {
    userModel
      .findOne({ username: user.username })
      .then(dbRes => {
        if (dbRes) {
          res.render("auth/signup", { errorMsg: "User already exists !" });
          return;
        }
        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(user.password, salt);
        user.password = hashed;
        userModel
          .create(user)
          .then(() => res.redirect("/"))
          .catch(err => console.log(err));
      })
      .catch(dbErr => {
        next(dbErr);
      });
  }
});

router.post("/login",(req,res,next)=>{
  const user = req.body;
  if (!user.username || !user.password) {
    res.render("auth/login", { errorMsg: "Please fill in all the fields" });
  }
  userModel
    .findOne({ username: user.username })
    .then(dbRes => {
      if (!dbRes) {
        res.render("auth/login", { errorMsg: "Bad username or password" });
        return;
      }
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        req.session.currentUser = user;
        res.redirect("/user");
        return;
      } else {
        res.render("auth/login", { errorMsg: "Bad username or password" });
        return;
      }
    })
    .catch(dbErr => {
      next(dbErr);
    });
});

// router.get("/logout", (req, res, next) => { 
//   req.session.destroy((err) => {
//     // res.locals.loggedin = "false";
//     res.redirect("/");
//   }); 
// });

module.exports = router;