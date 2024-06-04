const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("auth/signup");
});

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ username, email, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario.' });
  }
});

module.exports = router;
