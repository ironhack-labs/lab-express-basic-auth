const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.session.currentUser) {
    res.render('private/private');
  } else {
    const data = { message: 'Private eyes only. Login on register to access' };
    res.render('index', data);
  }
});

module.exports = router;
