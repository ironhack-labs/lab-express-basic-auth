const express = require("express");
const router = express.Router();

// router.get("/logout", (req, res, next) => {
//   req.session.destroy(err => {
//     res.redirect("/login");
//   });
// });

router.post("/logout", (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("/login");
  });
});

module.exports = router;
