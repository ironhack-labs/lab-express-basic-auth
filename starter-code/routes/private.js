const express = require('express')
const privateRouter = express.Router();

privateRouter.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  }
  else {
    res.redirect('auth/login');
  }
})

privateRouter.get('/', (req, res, next) => {
  res.render('private');
})

module.exports = privateRouter;
