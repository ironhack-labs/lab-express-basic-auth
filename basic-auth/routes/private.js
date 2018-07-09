const express = require('express')
const router  = express.Router()

router.get('/', (req, res, next) => {
  if(req.session.currentUser) {
    res.render('private/private')
  } else {
    res.redirect('/')
  }
})

router.get('/main',(req,res,next)=>{
  if(req.session.currentUser)
  res.render('private/main')
  else
  res.redirect('/')
})

module.exports=router
