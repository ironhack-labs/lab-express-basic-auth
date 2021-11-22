const router = require("express").Router();

// GET about us page
router.get("/about", (req, res) => {
  res.render("about");
});


module.exports = router;