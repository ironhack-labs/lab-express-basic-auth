const express = require("express")
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const userRoutes = require('./user.routes.js');
router.use('/auth',userRoutes);

const profileRoutes = require ('./profile.routes.js');
router.use('/profile', profileRoutes);

module.exports = router;
