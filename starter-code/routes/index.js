const express = require("express");
const auth = require("./auth");
const private = require("./private");

const router = express.Router();

router.use("/auth", auth);
router.use("/private", private);

router.get("/", (req, res, next) => {
  if (req.session.currentUser)
    return res.render("private/home", { user: req.session.currentUser });

  res.redirect("/auth/login");
});

module.exports = router;
