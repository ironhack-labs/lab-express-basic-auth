const router = require("express").Router();

router.get("/private", (request, response) => {
  if (!request.session.currentUser) {
    response.redirect("/user/login");
    return;
  }

  response.render("private.hbs", {
    userName: request.session.currentUser.username,
  });
});

module.exports = router;
