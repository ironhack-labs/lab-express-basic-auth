const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = requre('bcrypt');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



// --- iteration 1 ----

router.get('/signup', (req, res, next) => { // <-- access
  res.render('signup');
})


router.post('/signup', (req, res, next) => { // <-- create
  const {
    username,
    password
  } = req.body;

  if (username === "" || password === "") { // <-- check empty field
    console.log('fill all the field')
    res.redirect('signup')
  }


  const foundUser = User.findOne({
    username: username
  });

  if (foundUser) { // <-- check if already exist
    console.log('That username already exist')
    res.redirect('signup')
  }

  const salt = 10;
  const hashedPAssword = bcrypt.hashSync(password, salt); // <-- hashing user's password

  User.create({
    username,
    password: hashedPAssword,
  })

  res.render('index');


  .catch(err) {
    console.log(err)
  }


})


// --- iteration 2 ---
router.get('/login', (req, res, next) => {
  res.render('login');
})

router.post('/login', (req, res, next) => {
  const {
    username,
    password,
  } = req.body;

  if (username === "" || password === "") {
    console.log("fill all the field")
    res.redirect('login')
  }

  User.findOne({
      username: username
    })

    .then(findUser => {
      if (!findUser) {
        errormessage: 'invalid username';
        res.redirect('login')
      }
      else {
        if (bcrypt.compareSync(password, findUser.password)) {
          req.session.currenUser = findUser;
          console.log(`connected as ${req.session.currentUser}`);
          res.redirect('/')
        } else {
          errormessage: 'invalid password';
          res.redirect('login')
        }
      }
    })

    .catch((err) => {
      console.log(err)
    })

})



// --- iteration 3 ---
app.use((req, res, next) => {

  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('private');
  }
})

router.get('/main', (req, res, next) => {
  res.render('main')
});



module.exports = router;