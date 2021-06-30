const router = require("express").Router();

router.get("/main", (req, res, next) => {
    res.render("main");
  });
  
  module.exports = router;