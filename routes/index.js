const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  // req.session.platypus = "is it a fish? is it a mammal? don't know don't care"; // when visiting the page we make an property by default of an object called platypus
  console.log(req.session);
  res.render("index");
});

module.exports = router;
