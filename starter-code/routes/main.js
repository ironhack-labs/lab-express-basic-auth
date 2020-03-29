const express = require('express');
const app = express();

/* GET home page */
app.get('/main', (req, res) => {
  res.render('main');
});

module.exports = app;
