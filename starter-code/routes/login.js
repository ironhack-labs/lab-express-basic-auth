const express = require('express');
const router = express.Router();

//iniciar a sessão
router.get("/login", (req, res, next) => res.render("login"))
router.post("/login", (req, res, next) => {

  const { username, password } = req.body

  if (username === "" || password === "") {
    res.render("login", { errorMessage: "Favor preencher todos os campos." });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render("login", { errorMessage: "Oops...e-mail já existe!" })
        return
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user    // guarda o usuário na sessão atual
        res.redirect("/")
      } else {
        res.render("login", { errorMessage: "senha incorreta" })
      }
    })
    .catch(error => next(error))
})

module.exports = router;