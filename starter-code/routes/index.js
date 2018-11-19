const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');


const router  = express.Router();
router.get('/profile', (req, res) => {
  if (req.session && req.session.inSession) {
    const sessionData = { ...req.session  };
    res.render('profile', {
      sessionData,
    });
  } else {
    res.render('404');
  }
});


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.post('/', (req, res, next) => {
  const genericUserInstance = new User();

  const saltRounds = 5;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);

  genericUserInstance.password = hash;
  genericUserInstance.user = req.body.user;

  genericUser.password = hash;

  genericUser.save().then((x) => { // esto es lo que se guarda en la database
    req.session.inSession = true;

    res.json({
      inSessionCreated: true,
    });
  });
});


//   /*  genericUserInstance.save()
//     .then(() => res.redirect('/profile'))
//     .catch(err => console.log(`MONGO ${err}`)); */

//   User.create({ user: req.body.user, password: hash })
//     .then(() => res.redirect('/profile'))
//     .catch(err => console.log(`MONGO ${err}`));
// });


router.post('/profile', (req, res, next) => {
  res.render('profile');
});

router.post('/login', (req, res) => {
  User.findOne({
    user: req.body.user,
  }).then((found) => {
    const matches = bcrypt.compareSync(req.body.password, found.password);

    if (matches) {
      req.session.inSession = true;
      req.session.user = req.body.user;

      res.redirect('profile');
    } else {
      req.session.inSession = false;
      res.redirect('login');
    }
  });
});

module.exports = router;
