const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  let user = req.session.user
  res.render("index", user);
});

module.exports = router;
