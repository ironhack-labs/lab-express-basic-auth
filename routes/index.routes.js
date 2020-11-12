const express = require("express");
const router = express.Router();

router.get("/", (req, res) =>
  res.render("index", {
    title: "User Registration App 🚀",
  })
);

module.exports = router;
