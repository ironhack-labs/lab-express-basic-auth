const { Router } = require('express')
const router = Router()

router.get('/main',(req,res)=>{
  res.render('privates.views/main')
})
router.get('/private',(req,res)=>{
 res.render('privates.views/private')
})

module.exports = router