const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  const currentUser = req.session.currentUser;

  // Criar código aqui para helper - quando o currentUser está ativo e quando não está
  
  res.render('index', { currentUser });
});

/* MIDDLEWARE */
router.use((req, res, next) => {
  if (req.session.currentUser) {
    //what next does here is to redirect the user to the next route on our code --- order matters here! -- it will affect every single thing that it's after this next
    next(); 
  } else {
    res.redirect('/login');
  }
});

router.get('/main', (req, res, next) => {
  res.render('secrets/main');
});

router.get('/private', (req, res, next) => {
  res.render('secrets/private');
});

module.exports = router;
