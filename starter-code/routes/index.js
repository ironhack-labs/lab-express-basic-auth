const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../lib/isLoggedIn");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { title: "ENGLISH WE CAN" });
});

/* GET About page */
router.get("/about", (req, res, next) => {
  res.render("about", { title: "About Us" });
});

// Forma con isLooged In Middleware
router.get("/language-test", isLoggedIn(), (req, res, next) => {
  res.render("private/exam");
});

router.get("/notes", isLoggedIn(), (req, res, next) => {
  res.render("private/notes");
});

router.get("/profile", isLoggedIn(), (req, res, next) => {
  res.render("private/profile");
});

// Forma conditional //Cuidado con orden de llamadas routes en app.js si usas esta forma
// router.use((req, res, next) => {
//   if (req.session.currentUser) {
//     next();
//   } else {
//     res.redirect("/login");
//   }
// });
// router.get("/language-test", (req, res, next) => {
//   res.render("private/exam");
// });

// router.get("/notes", (req, res, next) => {
//   res.render("private/notes");
// });

// router.get("/profile", (req, res, next) => {
//   res.render("private/profile");
// });

module.exports = router;
