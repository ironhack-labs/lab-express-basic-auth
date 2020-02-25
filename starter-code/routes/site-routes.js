const express = require('express')
const router = express.Router()


router.get('/', (req, res, next) => {
  res.render("home")
})

router.use((req, res, next) => {
  if(req.session.currentUser) { 
    next(); 
  }else{                     
    res.redirect("/login");       
  }                              
}); 

router.get("/secret", (req, res, next) => {
    if(req.session.currentUser) {
        res.render("main")
    }else{
        res.redirect("/login")
    }
})

router.get("/secret2", (req, res, next) => {
    if(req.session.currentUser){
        res.render("private")
    }else{
        res.redirect("/login")
    }
})

module.exports = router