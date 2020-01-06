const express = require("express");
const router = express.Router();

//MAIN
router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.redirect("/login");         //    |
  }                                 //    |
}); // ------------------------------------                                
//     | 
//     V
router.get("/main", (req, res, next) => {
  res.render("main");
});

//PRIVATE
router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});
router.get("/private", (req, res, next) => {
  res.render("private");
})

router.get("/", (req, res, next) => {
  res.render("home");
});

module.exports = router;