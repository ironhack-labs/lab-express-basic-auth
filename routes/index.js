const express = require('express');
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  const username = req.app.locals.username;
  const data = {
    username: username
  };
  res.render('main', data);
});

module.exports = router;
