const User = require("../models/User.model");
const mongoose = require("mongoose");
const router = require("express").Router();

const bcryptjs = require("bcryptjs");
const {handlebars} = require("hbs");
const {isLoggedIn} = require('../middleware/route-guard')
const saltRounds = 12;

router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Please fill all the mandatory fields.",
    });
    return;
  }

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

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPass) => User.create({ username, password: hashedPass }))
    .then(() => {
      res.redirect('/userProfile');
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage: "Username need to be unique. Username is already used.",
        });
      } else {
        console.log(error);
      }
    });
});

router.get('/login',(req,res)=>{
    res.render('auth/login')
})

router.post('/login',(req,res)=>{
    const {username, password} = req.body

    if (username === '' || password === '') {
        res.render('auth/login', {
          errorMessage: 'Please enter both, email and password to login.'
        });
        return;
      }

    User.findOne({username})
    .then((user) => {
      if ( user === null) {
        res.render('auth/login', {
          errorMessage:'Please sign up'
        })
        return 
      } else if(bcryptjs.compareSync(password,user.password)) {
        const {username,_id} = user
        req.session.currentUser = {username,_id}
        req.app.locals.signedInUser = req.session.currentUser
        res.redirect('/userProfile')
      }
      else{res.render('auth/login', {
        errorMessage:'Password incorrect'
      })}
    })
})

router.post('/logout',(req,res)=>{
  req.session.destroy()
  req.app.locals.signedInUser=null
  res.redirect('/')
})

router.get('/main', isLoggedIn ,(req,res)=>{
  res.render('user/main')
})

router.get('/private',isLoggedIn,(req,res)=>{
  res.render('user/private')
})

module.exports = router;
