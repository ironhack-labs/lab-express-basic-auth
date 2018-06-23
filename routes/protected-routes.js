const express = require('express');
const router  = express.Router();

router.use((req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
  });
  
router.get("/private", (req, res, next) => {
    res.render("private/private");
});

router.get("/main", (req, res, next) => {
    res.render("private/main");
});


module.exports = router;
