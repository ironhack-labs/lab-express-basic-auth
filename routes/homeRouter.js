const express = require('express');
const router  = express.Router();

/* Auth: show signup form */
router.get("/", (req, res) => {
  console.log(req.session.currentUser)

  res.render("homeRouter",{user:req.session.currentUser});
  //res.render("homeRouter");
});


/* Auth: show signup form */
router.get("/protected", (req, res) => {
  if(req.session.currentUser){
   res.render("protected",{user:req.session.currentUser});
  }else{
    res.redirect("/")
  }
});


module.exports = router;


