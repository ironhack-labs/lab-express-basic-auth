const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const user = req.session.curentUser
  res.render("index");
});


module.exports = router;
