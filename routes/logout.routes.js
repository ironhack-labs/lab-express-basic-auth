const router = require("express").Router();

const { isLoggedIn } = require('../middleware/route-guard');

router.post('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });

module.exports = router;