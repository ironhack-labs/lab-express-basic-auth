const express = require('express');
const { isLoggedIn } = require('../middleware/index');
const router = express.Router();


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  const user = req.session.user
  res.render("profile", { user: user })
})
                     

module.exports = router;
