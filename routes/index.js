const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  const data = {};
  if(req.session.currentUser){
    data.theUser = req.session.currentUser;
  }
  res.render('index', data);
});

module.exports = router;
