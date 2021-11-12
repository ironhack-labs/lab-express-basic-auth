const router = require("express").Router();
const bcrypt = require("bcrypt");
const user = require("../models/User.model");

router.get("/", (req, res, next) => {
  res.render("register");
});

router.post("/", (req, res, next) => {
  const { username, password } = req.body;

  const bcryptSalt = 10;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  //Y encriptamos la contraseña
  const hashPass = bcrypt.hashSync(password, salt);

  user
    .create({ username, password: hashPass })
    .then((usercreate) => console.log(usercreate))
    .catch((error) => console.log(error));
  res.render("index");
});

module.exports = router;
