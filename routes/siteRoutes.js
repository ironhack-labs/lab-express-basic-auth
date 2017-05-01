const express = require('express');

const siteRoutes = express.Router();

siteRoutes.get('/', (req, res, next) => {
  res.render('index');
});

siteRoutes.get('/main', (req, res, next) => {
  res.render('main');
});

module.exports = siteRoutes;

