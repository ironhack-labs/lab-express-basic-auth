const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/new-user', users.controller.newUser);
router.post('/new-user', users.controller.createUser);

module.exports = router;