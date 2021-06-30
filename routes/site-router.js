
const express = require('express');
const siteRouter = express.Router()

siteRouter.use((req, res, next) => {
    console.log(req.session.currentUser) 
    if(req.session.currentUser){ 
        next()
    }else{
        res.redirect('/auth/login')
    }
})

siteRouter.get('/main', (req, res, next) => {
    res.render('site/protected-webpage');
  })
  
  siteRouter.get('/private', (req, res, next) => {
    res.render('site/personal-webpage');
  })

  siteRouter.get('/', (req, res, next) => {
    res.render('/index');
  })

  module.exports = siteRouter;