const express = require("express");
const router = express.Router();

router.get('/',(req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("welcome");
    return;
  }

  res.render('index');
});

module.exports = router;
