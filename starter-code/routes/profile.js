const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {
    res.redirect("/login");
  }
});

router.get("/profile/secret", (req, res) => {
  res.render("profile/secret");
});

module.exports = router;
