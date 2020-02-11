const express = require('express');
const router  = express.Router();

const authRouter = require("./auth");
const loginRouter = require("./login");
const mainRouter = require("./main");
const privateRouter = require("./private");

router.use("/signup", authRouter);
router.use("/login", loginRouter);
router.use("/main", mainRouter);
router.use("/private", privateRouter);




/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
