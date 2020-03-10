
//THIS PAGE WAS CREATED FOR SECRET ROUTES ONLY LOGGED IN USERS CAN USE!

const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
    if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
      next(); // ==> go to the next route ---
    } else {                          //    |
      res.redirect("/");         //    |
    }                                 //    |
  }); // ------------------------------------                                
  //     | 
  //     V
  router.get("/main", (req, res, next) => {
    res.render("main");
  });

router.get("/", (req, res, next) => {
  res.render("signup");
});


router.use((req, res, next) => {
    if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
      next(); // ==> go to the next route ---
    } else {                          //    |
      res.redirect("/");         //    |
    }                                 //    |
  }); // ------------------------------------                                
  //     | 
  //     V
  router.get("/private", (req, res, next) => {
    res.render("private");
  });

router.get("/", (req, res, next) => {
  res.render("signup");
});

module.exports = router;