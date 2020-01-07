const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index");
});

router.use((req, res, next) => {
    if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
      next(); // ==> go to the next route ---
    } else {                          //    |
      res.redirect("/");              //    |
    }                                 //    |
  }); // ------------------------------------                                
  //     | 
  //     V
  router.get("/content", (req, res, next) => {
    res.render("content");
  });

module.exports = router;
