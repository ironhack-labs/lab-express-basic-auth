var express = require("express");
var siteRouter = express.Router();

siteRouter.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } 
  else {
    res.redirect('/login')
  } 
});

siteRouter.get('/private', (req,res) => {
res.render('private');


})

module.exports = siteRouter;