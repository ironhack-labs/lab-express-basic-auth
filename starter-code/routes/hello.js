const express = require('express');
const app = express();

/* GET home page */
app.get('/hello', (req, res) => {
  res.render('hello');
});

module.exports = app;
