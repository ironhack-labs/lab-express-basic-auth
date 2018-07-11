const express = require('express');
const router  = express.Router();



router.get('/', (req, res, next) => {
  const data = {};
  if(req.session.currentUser){
    data.theUser = req.session.currentUser;
  }
  res.render('index',data);
});


router.get('/main', (req, res, next) => {
  const data = {};
  if(req.session.currentUser){
    data.theUser = req.session.currentUser;
  }
  res.render('main',data);
});


router.get('/private', (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/authRoutes/login");
  }
  
  const data = {};
  if(req.session.currentUser){
    data.theUser = req.session.currentUser;
  }
  res.render('private',data);
});

//main - Add a funny picture of a cat and a link back to the home page
//private - Add your favorite gif and an <h1> denoting the page as private.


module.exports = router;
