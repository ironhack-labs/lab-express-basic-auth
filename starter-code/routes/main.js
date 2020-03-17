const express = require('express');
const router  = express.Router();

router.use((req,res,next)=>{
    if (req.session.currentUser){
      next()
    } else res.redirect('/login')
  })

router.get('/main', (req,res)=>{
    res.render('main')
})

module.exports = router;