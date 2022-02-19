const router = require("express").Router();

const bcrypt = require('bcryptjs');
const { redirect } = require("express/lib/response");

const saltRounds = 10

const User = require('../models/User.model');


router.get("/signup", (_, res) => {
    res.render('auth/signup');
  });

router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  bcrypt
  .genSalt(saltRounds)
  .then(salt => bcrypt.hash(password, salt))
  .then(hashedPassword => {
    return User.create({
      username,
      password: hashedPassword
    })
  })
  .then(() => res.redirect('/'))
  .catch(error => console.log(error))
});

module.exports = router;