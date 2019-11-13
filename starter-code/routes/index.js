const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  console.log(req.session.user)
  res.render('index' , {loggedIn: req.session.user});
});

const loginCheck = () =>{
  return (req, res, next) => {
    if (req.session.user){
      next()
    }
    else {
      res.redirect("/")
    }
  }
}

router.get("/main", loginCheck(), (req, res) =>{
  res.render("main.hbs", {user: req.session.user})
})

router.get("/private", loginCheck(), (req,res) =>{
  res.render("private.hbs", {user: req.session.user})
})
 

module.exports = router;
