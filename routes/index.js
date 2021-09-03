const router = require("express").Router();
const bcrypt = require('bcryptjs')
const User = require("../models/User.model")

/* GET home page */


router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/registro", (req, res, next) => {
  res.render("sign-up")
})
router.post("/registro", (req, res) => {

  const { username, userPwd } = req.body

  if (userPwd.length === 0) {
    res.render('sign-up')
    return
  }
  if (username.length === 0) {
    res.render('sign-up')
    return
  }
  User
    .findOne({ username })
    .then(user => {
      if (user) {
        res.render('sign-up')
        return
      }
      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(userPwd, salt)

      User
        .create({ username, password: hashPass })
        .then(res.redirect("/"))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.get("/log-in", (req, res) => res.render("log-in"))
router.post("/log-in", (req, res) => {

  const { username, userPwd } = req.body

  if (userPwd.length === 0 || username.length === 0) {
    res.render("sign-up")
    return
  }

  User
    .findOne({ username })
    .then(user => {
      if (!user) {
        res.render("log-in")
        return
      }
      if (bcrypt.compareSync(userPwd, user.password) === false) {
        res.render("log-in")
      }

      req.session.currentUser = user
      res.redirect('/perfil')

    })
    .catch(err => console.log(err))
})

router.use((req, res, next) => {
  req.session.currentUser ? next() : res.render('log-in')
})
router.get('/perfil', (req, res) => {
  res.render('profile')
})



module.exports = router;
