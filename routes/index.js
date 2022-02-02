const router = require("express").Router();

const authRouter = require("./auth.routes");
router.use("/", authRouter);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
