const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


// middleware to protect a route
const loginCheck = () => {
  return (req, res, next) => {
    // check for a logged in user
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login')
    }
  }
}



// Before we go to the profile, we check if user is logged in
router.get("/profile", loginCheck(), (req, res, next) => {
  // this is how we can set a cookie
  res.cookie('ourCookie', 'hello node')
  console.log('this is our cookie: ', req.cookies)
  // to clear a cookie
  res.clearCookie('ourCookie');
  // we retrieve the logged in user from the session
  const loggedInUser = req.session.user
  res.render("profile", { user: loggedInUser });
});



//  the "const loginCheck" code checks if the user is logged in... then it implements the following code under it. 

// this is the code you need to render the main page, with the inclusion of the loginCheck!

router.get("/main", loginCheck(), (req, res, next) => {
  // we retrieve the logged in user from the session
  const loggedInUser = req.session.user
  res.render("main", { user: loggedInUser });
});

router.get("/private", loginCheck(), (req, res, next) => {
  // we retrieve the logged in user from the session
  const loggedInUser = req.session.user
  res.render("private", { user: loggedInUser });
});








//






module.exports = router;
