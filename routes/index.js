const router = require("express").Router()
const { logStatus } = require("../middleware/route-guard")

/* GET home page */
router.get("/", logStatus, (req, res, next) => {
  res.render("index")
});

module.exports = router;
