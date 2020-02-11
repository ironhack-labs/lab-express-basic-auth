var express = require("express");
var siteRouter = express.Router();

//Authentication Checker
siteRouter.use((req, res, next)=>{
  if(req.session.currentUser){
    next();
  }
  else{
    res.redirect("/login");
  }
});

siteRouter.get('/main',(req, res, next)=>{
  res.render('main');
})

siteRouter.get('/private',(req, res, next)=>{
  res.render('private')
})

module.exports = siteRouter;