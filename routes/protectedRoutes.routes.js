const express = require("express");
const protectedRoute = require("../middlewares/protectedRoutes");

const router = express.Router();

router.use(protectedRoute);

router.get("/main", (req, res, next) => {
  res.render("protected-views/main", { loggedUser: req.session.currentUser });
});

router.get("/private", (req, res, next) => {
  res.render("protected-views/private");
});

module.exports = router;
