const express = require("express");
const router = express.Router();

const signupRouter = require("./signup");
const loginRouter = require("./login");

router.use("/signup", signupRouter);
router.use("/login", loginRouter)

/* GET home page */
router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
