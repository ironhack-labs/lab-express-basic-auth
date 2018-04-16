const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// router.get('/main', (req, res, next) => {
//   res.render('main');
// });

/* Auth: show signup form */
router.get("/protected", (req, res) => {
  if(req.session.currentUser){
   res.render("protected",{user:req.session.currentUser});
  }else{
    res.redirect("/")
  }
});

module.exports = router;
