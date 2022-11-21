const router = require("express").Router();
const User = require("../models/User.model");
//Setup of bcryp
const bcrypt = require("bcrypt");
//Auth Check
const { isAuth } = require("../middleware/route-guard");

/* GET signup page */
router.get("/", (req, res, next) => {
  res.render("./auth/login");
});
router.post("/", async (req, res, next) => {
  const { userName, password } = req.body;

  if (userName === "" || password === "") {
    res.redirect("/login");
    console.log("\n 👉 Incorrect credentials redirecting to login... \n");
    return;
  }

  User.findOne({ userName })
    .then((user) => {
      if (!user) {
        console.log("🚨 Cant find the user");
        res.render("./auth/login");
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.isAuth = true;
        res.redirect(`/main`);
      } else {
        res.render("./auth/login");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
