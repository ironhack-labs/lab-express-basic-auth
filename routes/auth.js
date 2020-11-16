var express = require("express");
var router = express.Router();


const User = require("../models/User.model");

const bcrypt = require("bcryptjs");

router.get("/signup", function (req, res, next) {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
    
    if (req.body.email === "" || req.body.password === "") {
      res.render("auth/signup", {
        errorMessage: "Missing fields",
      });
      return;
    }
  
    const { email, password } = req.body;  
    
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
  
    try {
      
      const user = await User.findOne({ email: email });
      
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The email already exists!",
        });
        return;
      }
  
      await User.create({
        email,
        password: hashPass,
      });
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  });

  router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });
  
  router.post("/login", async (req, res, next) => {
    
    if (req.body.email === "" || req.body.password === "") {
      res.render("auth/login", {
        errorMessage: "Missing fields",
      });
      return;
    }
  
    const { email, password } = req.body;
  
    try {
      
      const user = await User.findOne({ email: email });
      console.log(user);
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The email doesn't exist",
        });
        return;
      }
      
      
      if (bcrypt.compareSync(password, user.password)) {
      
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password",
        });
      }
  
      
    } catch (error) {}
  });
/*
     router.get('/logout', (req, res, next) => {
       req.session.destroy((err) => {
         res.redirect('/login')
       })
     })
*/

module.exports = router;