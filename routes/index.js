const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {userIn: req.session.currentUser});
});

module.exports = router;
