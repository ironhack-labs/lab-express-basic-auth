const router = require("express").Router();

//Models
const User = require('../models/User.model')

//Middleware
const {isLoggedIn} = require("../middleware/route-guard")


//GET profile

router.get('/private', isLoggedIn, (req, res)=>{
  const {username} = req.session.loggedUser
  res.render("private.hbs", {username})
})

router.get('/main', isLoggedIn, (req, res)=>{
    const {username} = req.session.loggedUser
    res.render("main.hbs", {username})
  })
  
  


module.exports = router;
