//require express router
const router = require("express").Router();
//require auth middleware functions
const { isLoggedIn, isLoggedOut } = require("../middleware/route-gard.js");

//main - Add a funny picture of a cat and a link back to the home page
//private - Add your favorite gif and an <h1> denoting the page as private.

router.get("/main", isLoggedIn, (req, res) => {
  res.render("others/main", { userInSession: req.session.currentUser });
});

router.get("/private", isLoggedIn, (req, res) => {
  res.render("others/private", { userInSession: req.session.currentUser });
});

module.exports = router;
