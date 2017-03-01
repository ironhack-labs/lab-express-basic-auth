const express = require('express');
const siteRoutes = express.Router();
siteRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
});
siteRoutes.get('/secret', (req, res, next) => {
  res.render('secret-view.ejs');
});
siteRoutes.get('/cia-files', (req, res, next) => {
  res.render('cia-files.ejs');
});
module.exports = siteRoutes;
