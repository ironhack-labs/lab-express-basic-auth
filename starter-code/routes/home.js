const express = require("express");
const router = express.Router();
const UserMOdel = require("./../model/user");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("project_folder/home");
});

module.exports = router;
