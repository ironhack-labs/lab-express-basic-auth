const express = require("express");
const router = express.Router();
const authRouter = require('./auth.routes')
const userRouter = require('./user.routes')
const authMiddleware = require('../middlewares/auth.middlewares');

/*home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/main', authMiddleware.isNotAuthenticated, (req, res, next) => {
  res.render("main");
});

router.get('/private', authMiddleware.isAuthenticated, (req, res, next) => {
  res.render("private");
});

router.use('/', authRouter)

router.use('/user', userRouter)



module.exports = router;
