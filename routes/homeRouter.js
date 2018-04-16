const express = require('express');
const router  = express.Router();

/* Auth: show signup form */
router.get("/", (req, res) => {
  console.log(req.session.currentUser)

  res.render("homeRouter",{user:req.session.currentUser});
  //res.render("homeRouter");
});


/* Auth: show signup form */
router.get("/main", (req, res) => {
  if(req.session.currentUser){
   res.render("main");
  }else{
    res.redirect("/")
  }
});

router.get("/private", (req, res) => {
  if(req.session.currentUser){
   res.render("private");
  }else{
    res.redirect("/")
  }
});


module.exports = router;


