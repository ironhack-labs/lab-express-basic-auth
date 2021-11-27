const router = require("express").Router();
const { goHome, goPrivate } = require("../controllers");
const { isAnon, isLoggedIn } = require("../middlewares/auth.middlewares");

router.get("/", isAnon, goHome).get("/private", isLoggedIn, goPrivate);

module.exports = router;
