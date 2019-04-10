const mongoose = require('mongoose');

module.exports.home = (req,res,next) => {
  res.render('home')
}