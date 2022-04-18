const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// Auth routes
//User routes ............ LO HAGO A TRAVÉS DE app.js



module.exports = router;
