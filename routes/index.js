const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.use('/', require('./auth.routes.js'))
router.use('/', require('./private.routes.js'))


module.exports = router;
