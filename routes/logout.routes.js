const router = require("express").Router();
const User = require("../models/User.model");

router.get("/", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

module.exports = router;
