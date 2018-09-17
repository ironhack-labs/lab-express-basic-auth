const express = require('express');
const router  = express.Router();


/* private*/

router.get('/private', (req, res, next) => {
  res.render('private');
});


module.exports = router;
