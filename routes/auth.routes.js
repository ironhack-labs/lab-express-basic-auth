const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require("../models/User.model");
const router = require("express").Router();

router.get("/signup", (req, res) => {
    res.render('signup')
})

router.post("/signup", (req, res) => {
    const { email, password } = req.body;
  
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        console.log(`Password hash: ${hashedPassword}`);
  
        // Agora que temos o hash da senha, podemos criar o usuário com a senha hash
        User.create({ email, password: hashedPassword }) // <-- Use hashedPassword aqui
          .then(() => {
            console.log(email, hashedPassword);
            res.redirect("/");
          })
          .catch(err => {
            console.error(err);

          });
      })
      .catch(err => {
        console.error(err);

      });
  });
  
  module.exports = router