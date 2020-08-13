const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => res.render("index"));

/* GET user profile  page */
router.get("/userprofile", (req, res) => {
  // console.log(req.session.userInformation);
  res.render("userprofile", { userDetails: req.session.userInformation });
});

router.get("/log-out", (req, res) => {
  console.log(" logout clicked ");
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
