const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { role, ...restUser } = req.body;

  const salt = bcryptjs.genSaltSync(12);
  const newPassword = bcryptjs.hashSync(restUser.password, salt);

  User.create({ ...restUser, password: newPassword })
    .then((user) => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log("Error", error);
      next();
    });
});

//iteración 2

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username }) //findOne es para las condiciones
    .then((user) => {
      //console.log("el usurio",user); el usuario es un objeto

      if(bcryptjs.compareSync(password,user.password)){

res.send("te logeeaste con exito")

//res.redirect(`/auth/profile/${user._id}`)

        } else{
            res.send("no es la contrasen1a o username, bro")
        } 
    })
    .catch((err) => {
      console.log("un error buscando el usuario", err);
      next();
    });
});

module.exports = router;
