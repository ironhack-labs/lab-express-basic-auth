const express = require("express");
const router = express.Router();
const UserMOdel = require("./../model/user");

/* GET home page */
router.get("/", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("project_folder/private");
  } else {
    res.redirect("project_folder/login");
  }
});

module.exports = router;
