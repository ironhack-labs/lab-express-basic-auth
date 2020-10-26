const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("home");
});

//We want to prevent the users who are not logged from accessing this page. We can do that by writing our own MIDDLEWARE. We will add the following before the protected route (all the routes after this middleware will need authentication in order to be accessed):
router.use((req, res, next) => {
    if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
      next(); // ==> go to the next route ---
    } else {                          //    |
      res.redirect("/login");         //    |
    }                                 //    |
  }); // ------------------------------------                                
  //     | 
  //     V
  router.get("/secret", (req, res, next) => {
    res.render("secret");
  });
  



module.exports = router;
