const express = require("express");
const router = express.Router();
const userRouter = require("./user");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.use("/user", userRouter);
router.get("/main", (req, res, next) => {
  res.render("main");
});
router.get("/private", authCkeck, (req, res, next) => {
  res.render("private");
});
function authCkeck(req, res, next) {
  if (req.session.currentUser) {
    // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {
    //    |
    res.redirect("/user/signin"); //    |
  } //    |
}
module.exports = router;
