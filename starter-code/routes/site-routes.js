const express = require('express');
const siteRouter = express.Router();

siteRouter.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('auth/signup');
  }
});

siteRouter.get('/', (req, res, next) => {
  res.render('home', {
    user: req.session.currentUser
  })
  console.log(req.session.currentUser.username)
})

siteRouter.use((req, res, next) => {
  if (req.session.currentUser) {
    console.log('session next');
    next();
   
  } else {
    res.redirect('/login');
  }
});

siteRouter.get('/secret', (req, res, next) => {
  console.log('in secret')
  res.render('secret', {
    user: req.session.currentUser
  });
  
})

module.exports = siteRouter;