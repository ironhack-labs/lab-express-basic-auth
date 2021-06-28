const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/new-user', users.controller.createUser);
router.post('/new-user', users.controller.doCreateUser);

module.exports = router;