const { Router } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const saltRounds = 13;
const router = Router();

router.get("/signup", (req, res) => {
    res.render("auth/signup");
  });

  router.get("/signup", (req, res, next) => {
  const { username, password } = req.body;
  bcrypt.genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => User.create({username, password: hashedPassword}))
    .then((user) => {
     console.log(user)
    })
    .catch((err) => next(err));
  
router.get("/profile", (req, res) => {
  res.render("users/users-profile");

  router.post("/signup",(req, res, next) => {
  const { username, password } = req.body;

  
  if (!username ||!password) {
    res.render('auth/signup', {
      errorMessage:
      "enter your username, and password',
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(400).render('auth/signup', {
      errorMessage:
        'The password must contain uppercase and lowercase letter, digits and be at least 6 characters long',
    });
    return;
  }

  router.get('/login', (req, res) => {
    res.render('auth/signin');
  });
  
  router.get('/profile', (req, res) => {
    res.render('users/user-profile', { user: req.session.currentUser });
  });
  
  router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    
    if (!email || !password) {
      res.render('auth/signin', {
        errorMessage: 'Please fill all the fields',
      });
      return;
    }
  
  
    router.post('/logout', (req, res) => {
      req.session.destroy((err) => {
        res.redirect('/login');
      });
    });
    
    module.exports = router;
