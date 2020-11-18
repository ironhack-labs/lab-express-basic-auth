const express = require("express");
//const { route } = require("./auth.routes");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  //console.log(req.session);
  res.render("index");
  console.log(req.session);
  //const { user } = req.session;
  //   //console.log("user:", user);
  //   res.render("index", { user });
});

module.exports = router;
