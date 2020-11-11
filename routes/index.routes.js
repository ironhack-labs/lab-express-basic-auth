const express = require("express");
const router = express.Router();

router.get("/", (req, res) =>
  res.render("index", { title: "App created with Ironhack generator 🚀" })
);

module.exports = router;
