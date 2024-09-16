const router = require("express").Router();
const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// Auth routes
router.use('/', authRouter);

// User routes
router.use('/user', userRouter);


module.exports = router;
