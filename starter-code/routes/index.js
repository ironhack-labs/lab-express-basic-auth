const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  if(res.locals.user){
    res.render('user/main', {title: res.locals.user.firstName})
  } else {
    res.render('index', {title: 'Cats'});
  }
});

module.exports = router;
