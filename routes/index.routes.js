const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// const checkIfLoggedin = () => {
//   return (req, res, next) => {
//     //check if user is logged in:
//     if (req.session.user) {
//       next();
//     } else {
//       //otherwise back to login
//       res.redirect("/auth/login");
//     }
//   };
// };

module.exports = router;
