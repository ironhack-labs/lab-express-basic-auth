const router = require("express").Router();

const bcryptjs = require('bcryptjs');

const User = require('../models/User.model');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signup', (req, res, nex) => {
  res.render('signup.hbs');
});

router.post('/signup', (req, res, nex) => {
  console.log(req.body);

  if (!req.body.username || !req.body.password) {
      res.send('cant have empty fields');
      return;
  }

User.findOne({username: req.body.username}) 
.then(foundUser => {
  if(foundUser) {
    res.send('sorry user already exists')
    return;
  }

  const myHashedPassword = bcryptjs.hashSync(req.body.password)
  
  return User.create({
      username: req.body.username,
      password: myHashedPassword
  })
})
  .then((newUser) => {
      console.log('new user created', newUser);
      res.send(newUser);
      res.render('signup.hbs')
  })
  .catch(err => {
      console.log(err);
      res.send(err);
  })
});


module.exports = router;
