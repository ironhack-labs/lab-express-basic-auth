const {Router} = require("express")
const router = new Router();

const bcryptjs = require('bcryptjs');
const UserModel = require('../models/User.model');
const saltRounds = 10;

/* GET home page */
router.get("/signup", (req, res) =>
  res.render("auth/signup"));

//POST route
router.post('/signup', (req, res, next) =>{
  const { username, password } = req.body;

  bcryptjs
  .genSalt(saltRounds)
  .then((salt) => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
    console.log(`Password hash: ${hashedPassword}`);
    UserModel.create({
      username,
      passwordHashed: hashedPassword
    });
  })
  .then((createdUser) =>{
    console.log('Newly created user:', createdUser)
    res.redirect('/')
  })
  .catch(error => next (error));
});

router.get('userProfile', (req, res) => res.render('users/user-profile'));

module.exports = router;
