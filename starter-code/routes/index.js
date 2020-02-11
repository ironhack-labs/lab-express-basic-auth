const express = require("express");
const router = express.Router();

const signupRouter = require("./signup");

router.use("/signup", signupRouter);

/* GET home page */
router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
