const express = require('express');
const router = express.Router();

/*PROTECTED PAGE*/
router.use((req, res, next) => {
    if (req.session.currentUser) { 
      next(); 
    } else {
      res.redirect("/auth/login");
    }
});

router.get("/private", function (req, res, next) {
    res.render("protected-private");
});

module.exports = router;