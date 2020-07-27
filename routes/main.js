const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    if (req.session.currentUser) { 
      next(); 
    } else {
      res.redirect("/auth/login");
    }
});

router.get("/main", function (req, res, next) {
    res.render("main");
});

module.exports = router;