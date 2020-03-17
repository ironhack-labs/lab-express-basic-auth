const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get("/signup", (req, res) =>{
    res.render("user/signup.hbs");
})

router.post("/signup", (req, res)=>{
    const {username, password} = req.body;
    User
    .create({
        username: username,
        password: password
    })
    .then((newUser) => {
        if (newUser.username === "" || newUser.password === "")
            res.send('Invalid credentials! You need to fill username and password.');
        else if (newUser.username === newUser.password)
            res.send('Username and password can not be the same. Please, try again!')
        else {
            req.session.currentUser = newUser;
             res.redirect('/user/login');
        }
    })
    .catch(err=>{
        res.send("User not created", err);
    })
})

router.get("/login", (req, res) =>{
    res.render("user/login.hbs");
})

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  User
  .findOne({
    username
  })
    .then(newUser => {
      if (!newUser) res.send ('Invalid! This user account does not exist.')
    //   res.redirect("/user/main")
      else if (newUser.password !== password)  res.send('Invalid password. Please, try again!');
    //   res.redirect('/user/main');
      else {
        req.session.currentUser = newUser;
        res.redirect('/user/private');
      }
    })
    .catch(err => {
      res.send('Error, login did not work', err);
    });
});

router.get('/private', (req, res) => {
  res.render('user/private.hbs');
});

// router.get('/main', (req, res) => {
//   res.render('user/main.hbs');
// });


module.exports = router;
