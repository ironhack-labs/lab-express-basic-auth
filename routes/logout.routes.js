const router = require("express").Router();

router.get("/", (req, res) => {
  console.log("ENTRA AQUI");
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
