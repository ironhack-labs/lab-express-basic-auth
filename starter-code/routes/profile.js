const express = require('express');
const app = express();

/* GET home page */
app.get('/profile', (req, res) => {
  res.render('user/profile');
});

module.exports = app;