var express = require("express");
var router = express.Router();

const loginRouter = require("./login");
const siteRouter = require("./site-routes");
const authRouter = require("./auth");

router.use("/login", loginRouter);
router.use("/signup", authRouter);
router.use("/", siteRouter);

router.get("/", (req, res) => {
  res.render("index", { title: "Basic auth" });
});

module.exports = router;