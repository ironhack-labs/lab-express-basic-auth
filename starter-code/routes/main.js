// const express = require("express");
// const router = express.Router();
// const protectRoute = require("../middlewares/protectRoute");

// router.get("/main",protectRoute, (req, res, next) => {
//   res.render("main");
// });

// router.use((req, res, next) => {
//     if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
//       next(); // ==> go to the next route ---
//     } else {                          //    |
//       res.redirect("/");         //    |
//     }                                 //    |
//   }); // ------------------------------------                                
//   //     | 
//   //     V
//   router.get("/private", (req, res, next) => {
//     res.render("private");
//   });

// module.exports = router;