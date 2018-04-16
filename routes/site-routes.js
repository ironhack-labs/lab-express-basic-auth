const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  if (req.session.currentUser) {
    let user = req.session.currentUser;
    console.log(user);
    res.render('index', {user});
  } else {
    res.render('index'); 
  }

  
});

module.exports = router;
