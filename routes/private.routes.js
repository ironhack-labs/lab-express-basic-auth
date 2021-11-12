const router = require("express").Router();

router.use((req, res, next) => {
  console.log(req.session);
  req.session.currentUser ? res.render("private") : res.render("public");
});
module.exports = router;
