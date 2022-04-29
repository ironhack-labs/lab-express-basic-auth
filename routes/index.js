const router = require("express").Router();
const {isLoggedIn, isLoggedOut} = require("../middleware/auth.middleware")


/* GET home page */
router.get("/", isLoggedOut,  (req, res, next) => {
  res.render("index");
});

module.exports = router;
