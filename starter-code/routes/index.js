const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const userRouter = require("./user");

// require authentication and protected routes
router.use("/auth", authRouter);
router.use("/user", userRouter);

/* GET home page */
router.get("/", (req, res, next) => {
  if (res.locals.user) {
    res.render("user/main", { title: res.locals.user.firstName });
  } else {
    res.render("index", { title: "Cats" });
  }
});

module.exports = router;
