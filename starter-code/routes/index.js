const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  if (req.session.currentUser) { 
    res.redirect("/user");
  } else {                          
    res.render("index");         
  } 
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});


router.get("/user",(req,res)=>{
  console.log(req.session.currentUser)
  if (req.session.currentUser) { 
  res.render("auth/user", {currentUser: req.session.currentUser}); 
} else {                          
  res.redirect("/login");         
} 

});

router.get("/logout", (req, res, next) => { 
  req.session.destroy((err) => {
    res.locals.loggedin = "false";
    res.redirect("/login");
  }); 
});

module.exports = router;
