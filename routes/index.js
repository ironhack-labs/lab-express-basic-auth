const router = require("express").Router();

//don't forgets: always export. always put all the routes in the app.js

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.currentUser });
});

router.get("/profile", (req, res, next) => {
  res.render(
    "user/profile",
    //keeps the user logged in (cookies)
    { user: req.session.currentUser }
  );
});

module.exports = router;
