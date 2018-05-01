const express = require('express');
const router  = express.Router();


router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      // cannot access session here
      res.redirect("/login");
    });
  });

  
  module.exports = router;