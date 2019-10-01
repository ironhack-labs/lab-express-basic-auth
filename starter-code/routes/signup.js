const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const User = require('../models/user')

router.get("/signup", (req, res) => res.render("signup"))
router.post("/signup", (req, res, next) => {

const { username, password } = req.body
///check em campos vazios
if (username === "" || password === "") {
  res.render("signup", {
    errorMessage: "Favor preencher todos os campos"
  })
  return // Em caso de não validação, abandona a função sem criar o usuário e hash
}
///Validação de e-mail duplicado
User.findOne({ username })
.then(user => {
  if (user) {
    res.render("signup", { errorMessage: "Oops...e-mail já existe!" });
    return;
  }
})
.catch(err => console.log('ERROR:', err))

  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  User.create({ username, password: hashPass })
    .then(() => res.redirect('/'))
    .catch(err => console.log('ERROR:', err))
})

module.exports = router;