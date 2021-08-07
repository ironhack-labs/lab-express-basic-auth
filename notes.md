const router = require("express").Router();

const User = require("../models/User.model");

const bcrypt = require('bcryptjs');
const saltRounds = 10;

// ******************************************\*\*\*\*******************************************
// GET route to display the form to "register" a user
// ******************************************\*\*\*\*******************************************

router.get('/register', (req, res) => {
res.render('users/create')
})

router.post('/user-create', (req, res) => {

// generate salt
const salt = bcrypt.genSaltSync(saltRounds);
// create a hashed version of the password
const hash1 = bcrypt.hashSync(req.body.password, salt);

User.create({ username: req.body.username, posts: [], password: hash1 }).then(() => {
res.redirect('/')
})

})

module.exports = router;

CORRESPONDING FORM

<h2>Registration</h2>

<form action="/user-create" method="POST">
  <label> Username:
    <input type="text" name="username" />
  </label>
  <label> Password:
    <input type="text" name="password" />
  </label>
  <br>

<button type="submit"> Register </button>

</form>

INCLUDED IN THE USER SCHEMA

password: { type: String, required: true }
