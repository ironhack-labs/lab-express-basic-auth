const express = require('express');
const router  = express.Router();

router.get("/", (req, res, next) => {
  const currentUser = req.session.currentUser;
  res.render("index", {
    currentUser,
  });
});

// router.use => middleware
router.use((req,res,next)=>{
  if (req.session.currentUser) {
    //next here redirects the user to the next rout in line (=> secret rout here)
    next();
  } else {
    res.redirect('/login');
  }
});

router.get('/main', (req,res,next)=>{
  res.render('secrets/cat');
});

router.get("/private", (req, res, next) => {
  res.render("secrets/fav-gif");
});

module.exports = router;
