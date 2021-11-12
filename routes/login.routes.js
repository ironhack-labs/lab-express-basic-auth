const router = require("express").Router();
const user = require("../models/User.model");
const bcrypt = require("bcrypt");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("login");
});

router.post("/", (req, res, next) => {
  const { username, password } = req.body;
  user
    .findOne({ username })
    .then((userfound) => {
      if (userfound != undefined) {
        if (bcrypt.compareSync(password, userfound.password) === false) {
          res.render("login", { error: "Contraseña incorrecta" });
          return;
        } else {
          console.log(req.session);
          req.session.currentUser = userfound;
          res.redirect("/");
        }
      } else {
        res.render("login", { error: "usuario no encontrado" });
      }
    })
    .catch((error) => console.log(error));
});

module.exports = router;
