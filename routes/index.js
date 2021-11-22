const router = require("express").Router();
const isLoggedIn = require("./../middleware/isLoggedIn");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// GET /secret
router.get("/secret", isLoggedIn, (req, res) => {
  res.render("secret");
})


module.exports = router;