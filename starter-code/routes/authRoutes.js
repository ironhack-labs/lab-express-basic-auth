const express           = require('express');
const router            = express.Router();


function auth(req, res, next) {

  if (req.session.currentUser) {
    next();
  } else{
    res.redirect('/');
  }
}

  router.use(auth);

  router.get("/main", (req, res, next) => {
    res.render('main');
  });

  router.get("/private", (req, res, next) => {
    res.render('private');
  });
module.exports = router;
