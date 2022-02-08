const router = require("express").Router();
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.post('/', (req,res,next) =>{
  const {username, password} = req.body;

  User.create({username, password})
  .then(() => {
      res.redirect('/');
  })
  .catch(error => {res.render('layout.hbs'); next(error)});
});

module.exports = router;
