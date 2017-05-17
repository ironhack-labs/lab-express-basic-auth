var express = require("express");
var router = express.Router();

//
// router.get('/', (req, res, next) =>{
//   res.render('user', {title: "User"});
// });


//SECRET ROUTES
router.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

router.get('/', function(req, res, next) {
  res.render('user');
});





module.exports = router;
