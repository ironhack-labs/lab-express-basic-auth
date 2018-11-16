const express = require('express');
const router = express.Router();
//const MongoStore = require("connect-mongo")(session);
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const User = require("../models/user");
const genericUser = new User();


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/createUser', (req, res, next) => {
  //   res.render('index');
});

router.post('/createUser', function (req, res) {
    console.log(req.body.user)
    console.log(req.body.password)
  const saltRounds = 5;
  if (req.body.user === '' || req.body.password === '') {
    res.redirect('/');
  } else {
    genericUser.user = req.body.user;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    genericUser.password = hashedPassword
    //Save the new user created in the form with the schema User
    genericUser.save().then(x => { 
      console.log(`User ${x.user} has been saved on database mongo`)
      res.render('login');
    })
  }

})

module.exports = router;