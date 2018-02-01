const express = require('express');
const router = express.Router();

const User = require('../models/user');
const authMiddleware = require('../middlewares/auth');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/private', authMiddleware('/login'), (req, res, next) => {
  const userId = req.session.currentUser;

  User.findById(userId)
    .then((user) => {
      res.render('private', { title: "private" });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;