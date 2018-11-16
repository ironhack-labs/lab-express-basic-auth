const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');

const genericUser = new User();


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});
router.get('/login', (req, res, next) => {
  res.render('login');
});
router.get('/error', (req, res, next) => {
  res.render('error');
});
// router.get('/private', (req, res, next) => {
//   res.render('secret');
// });

router.get('/private', (req, res) => {
  if (req.session.inSession) {
    const sessionData = { ...req.session  };
    res.render('private', {
      sessionData,
    });
  } else {
    res.render('main');
  }
});

router.get('/main', (req, res) => {
    res.render('main');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    // req.session = null;
    res.redirect('/');
  });
});



router.post('/createdUser', (req, res) => {
  if (req.body.user === "" || req.body.password === "") {

    res.redirect('error');
    return
  }
  User.findOne({
    user: req.body.user
  })
    .then(found => {
      if (found) {
        console.log("HOLA HOLA")
        res.redirect('error');
        return
      } else {
        const saltRounds = 5;
        genericUser.user = req.body.user;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        genericUser.password = hashedPassword;
        genericUser.save().then(() => {
          req.session.inSession = true;
          res.render('createdUser');
        });
      }

    })
});

router.post('/login', (req, res, next) => {
  if (req.body.user === "" || req.body.password === "") {
    res.redirect('error');
    return
  }
  User.findOne({
    user: req.body.user
  })
    .then(found => {
      const match = bcrypt.compareSync(req.body.password, found.password);
      if (match) {
        req.session.inSession = true;
        req.session.user = req.body.user;
        res.redirect('private');
      } else {
        req.session.inSession = false;
        res.redirect('login');
      }
    })
});





module.exports = router;
