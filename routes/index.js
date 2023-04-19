const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* Sign up */
router.get("/sign-up", (req, res, next) => {
  res.render("sign-up");
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.render("sign-up", { errorMessage: "Por favor completa los campos" });
      return;
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
