const router = require('express').Router();

router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;
