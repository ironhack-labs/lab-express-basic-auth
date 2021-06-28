const router = require("express").Router();
const usersController = require('../controller/users.controller');

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/new-user', usersController.newUser);
router.post('/new-user', usersController.createUser);

module.exports = router;