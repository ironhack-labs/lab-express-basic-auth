const express = require('express');
const bcrypt = require('bcrypt')
const router  = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.redirect("/login");         //    |
  }                                 //    |
}); // ------------------------------------                                
//     | 
//     V

router.get('/', (req, res, next) => {
  const { currentUser } = req.session;
  res.render('private', {currentUser});
});

module.exports = router;