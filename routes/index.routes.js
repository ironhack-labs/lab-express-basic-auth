const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  const loggedInUser = req.session.user;
  console.log(loggedInUser);
  res.render('index', { user: loggedInUser });
});

const loginCheck = () => {
  return (req, res, next) => {
    // if the user is logged in we proceed as intended (call next())
    if (req.session.user) {
      next();
    } else {
      // if user is not logged in we redirect to login
      res.render('access-denied');
    }
  };
};

router.get('/private', loginCheck(), (req, res, next) => {
  const loggedInUser = req.session.user;
  console.log(loggedInUser);
  res.render('private', { user: loggedInUser });
});

module.exports = router;
