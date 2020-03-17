const express = require('express');
const router  = express.Router();

//check if user is logged in
router.use((req,res,next)=>{
    if (req.session.currentUser){
      next()
    } else res.redirect('/login')
  })

router.get('/main', (req,res)=>{
    res.render('main')
})

router.get('/media', (req,res)=>{
    res.render('private')
})

router.get('/logout', (req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/login')
    })
})

module.exports = router;