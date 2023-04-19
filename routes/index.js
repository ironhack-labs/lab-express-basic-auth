const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();


router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  const user = req.session.user
  res.render("profile", { user: user })
   })


module.exports = router;
