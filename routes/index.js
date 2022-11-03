const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const username = req.session.user.username
  res.render("index", {username});
});

module.exports = router;
