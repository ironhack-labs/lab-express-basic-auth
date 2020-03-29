const express = require('express');
const app = express();

/* GET home page */
app.get('/private', (req, res) => {
  res.render('private');
});

module.exports = app;
