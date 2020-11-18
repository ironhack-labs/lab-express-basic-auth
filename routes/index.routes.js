const express = require('express');
const router = express.Router();

/* GET home page */
// router.get('/', (req, res, next) => {
//     res.render('index');
// });

router.get('/', (req, res, next) => {
  const loggedinUser = req.session.user;
  console.log({ loggedinUser });
  res.render('index', { user: loggedinUser });
});

const loginCheck = () => {
  return (req, res, next) => {
    // if the user is logged in we proceed as intended (call next())
    if (req.session.user) {
      next();
    } else {
      // if user is not logged in we redirect to login
      res.redirect('/login');
    }
  }
}

router.get('/private', loginCheck(), (req, res, next) => {
  res.render('private');
});

router.get('/main', loginCheck(), (req, res, next) => {
    console.log('what is going on here')
    res.render('main');
  });
  


module.exports = router;
