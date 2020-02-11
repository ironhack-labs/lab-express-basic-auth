const express = require('express');
const router  = express.Router();

const authRouter = require("./auth");
const loginRouter = require("./login")

router.use("/signup", authRouter);
router.use("/login", loginRouter)

router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
