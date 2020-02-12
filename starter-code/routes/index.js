const express = require("express");
const router = express.Router();
const loginRouter = require("./login");
const authenticationRouter = require("./auth");
const privateRouter = require("./private-routes");

router.use("/login", loginRouter);
router.use("/signup", authenticationRouter);
router.use("/", privateRouter);

/* GET home page */
router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
