const router = require("express").Router();
const User = require(`../models/User.model`)
const bcrypt = require(`bcryptjs`)

/* GET home page */
router.get("/", (req, res, next) => {
  res.render(`auth/register`);
});

router.post(`/register`, async (req, res) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  const newUser = {
    username: req.body.username,
    password: hashedPassword
  }
  User.create(newUser).then((data) => {
    res.render(`index`, { user: data })
  })
    .catch((error) => res.json(error))
})

module.exports = router;
