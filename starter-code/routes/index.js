const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      console.log("user logged in");
      next();
    } else {
      res.redirect("login");
    }
  };
};
