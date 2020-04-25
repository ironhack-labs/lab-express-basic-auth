const express = require('express');
const router  = express.Router();
const requireAuth = require("../middlewares/requireAuth");

router.get("/main", requireAuth, (req, res) => {
    res.render("main");
  });

  router.get("/private", requireAuth,  (req, res) => {
    res.render("private");
});


module.exports = router;