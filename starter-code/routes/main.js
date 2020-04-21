const express = require("express");
const router =  new express.Router();
const requireAuth = require("../middlewares/requireAuth");



router.get("/", requireAuth, (req, res) => {
  res.render("main.hbs")
})

module.exports = router;