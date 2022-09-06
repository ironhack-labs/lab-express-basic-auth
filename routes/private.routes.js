const router = require("express").Router();


router.get("/private", (req, res, next) => {
    res.render("private");
  });

  router.get('/main', (req, res) => {
    res.render('main');
  });

  
module.exports = router;
