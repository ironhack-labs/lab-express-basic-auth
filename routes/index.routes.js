const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")
const bcryptSalt = 10
const mongoose = require("mongoose")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const User = require("../models/User.model")

router.use(session(
	{
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 
    })
  }));

  
/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get("/sign-up", (req, res, next)=>{
	res.render("signUp")
})

router.post("/sign-up", (req, res, next)=>{
	const username = req.body.username;
    const password = req.body.password;
    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashedPassword = bcrypt.hashSync(password, salt);

    if (username === "" || password === "") {
        res.render("signUp", {
          errorMessage: "Type in both email and password"
        });
        return;
      }   

    User.findOne({ "username": username })
      .then(user=>{

        if (user !== null) {

            res.render("signUp", {

              errorMessage: "Someone was faster and got that username before!"

            });
            return;
          }

          const salt     = bcrypt.genSaltSync(bcryptSalt);
          const hashedPassword = bcrypt.hashSync(password, salt);

          User.create({ username, password: hashedPassword})
          
          .then(() => {

            res.redirect("/");

          })
          .catch(error => {

            console.log(err);
            res.render(err)
          })
      })
      .catch(error => {
        next(error);
      })    
});


router.get("/log-in", (req, res, next) => {
    res.render("logIn");
  });

router.post("/log-in", (req, res, next) => {

  const userUsername = req.body.username;
  const userPassword = req.body.password;

  
  if (userUsername === "" || userPassword === "") {

    res.render("logIn", {
      errorMessage: "Type in both email and password"
    });
    return;
  }

  User.findOne({ "username": userUsername })
  .then(user => {

      if (!user) {
        res.render("logIn", {
          errorMessage: "Nope, wrong username"
        });
        return;
      }
      if (bcrypt.compareSync(userPassword, user.password)) {
        
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("logIn", {
          errorMessage: "Nope, try again your password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});


router.use((req, res, next) => {

    if (req.session.currentUser) { 

    next()
    
	  console.log(session.currentUser) 
    } else {                          
      res.redirect("/log-in");         
    }                                 
  });                               
     
  router.get("/private", (req, res, next) => {
    res.render("private");
  });

  router.get("/main", (req, res, next) => {
    res.render("main");
  });




module.exports = router;
