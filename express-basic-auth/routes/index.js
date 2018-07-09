const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.locals.user = req.session.user
  res.render('index');
});

router.get("/main",(req,res)=>{
  if(req.session.user){
    res.render("main")
  }else{
    res.redirect("/")
  }
})
router.get("/private",(req,res)=>{
  if(req.session.user){
    res.render("private")
  }else{
    res.redirect("/")
  }
})

module.exports = router;
