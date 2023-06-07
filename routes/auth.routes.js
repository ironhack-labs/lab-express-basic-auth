const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const {username, password} = req.body;
  const hash = bcryptjs.hashSync(password);
  User.create({ username, password: hash})
    .then(user => {
      res.send(`user ${user.username} created!`);
    })
    .catch(error => {
      res.send("Error:" + error);
    })
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const {username, password} = req.body;
  User.findOne({username})
    .then(user => {
      if (!user) {
        res.send("Invalid username");
        return;
      }

      const isSuccess = bcryptjs.compareSync(password, user.password);
      if (isSuccess) {
        req.session.currentUser = user.username;
        res.redirect("/main")
      } else {
        res.send("Invalid password");
        return;
      }
    })
    .catch(error => {
      res.send("Error:" + error);
    })
});

router.get("/main", (req, res, next) => {
  console.log("session:", req.session);
  res.render("auth/main", req.session);
});


module.exports = router;
