const express = require("express");
const router = express.Router();




 router.get('/logout', (req, res, next)=> {
  if (req.session) {
    req.session.destroy();
  
}
  res.render('auth/login')
});


router.get("/main", (req,res,next) => {
  res.render('users/main.hbs', {userInSession: req.session.currentUser})
});



router.get("/private", (req,res,next) => {
  res.render('users/private.hbs', {userInSession: req.session.currentUser})
});


module.exports = router