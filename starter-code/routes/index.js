const express = require("express");
const router = express.Router();
let randomCat = require("random-cat");

/* GET home page */
router.get("/", (request, response, next) => {
  response.render("index");
});

// Iteration 2: code from Teacher notes
const loginCheck = () => {
  return (request, response, next) => {
    if (request.session.user) {
      console.log("user logged in");
      next();
    } else {
      response.redirect("login");
    }
  };
};

router.get("/profile", loginCheck(), (request, response) => {
  console.log("this is the cookie: ", request.cookies);
  response.cookie("myCookie", "pp");
  console.log("this is the user id: ", request.session.user._id);
  response.render("profile");
});

// Iteration 3:
router.get("/main", loginCheck(), (request, response) => {
  console.log("this is the cookie: ", request.cookies);
  response.cookie("myCookie", "pp");
  console.log("this is the user id: ", request.session.user._id);
  let randomCatUrl = randomCat.get({
    width: 600,
    height: 600,
  });
  response.render("main", { randomCatUrl });
});

router.get("/private", loginCheck(), (request, response) => {
  console.log("this is the cookie: ", request.cookies);
  response.cookie("myCookie", "pp");
  console.log("this is the user id: ", request.session.user._id);
  response.render("private");
});

// Iteration 2 with code from instructions doesn't work -> gets redirected in loop until crash
// router.use((request, response, next) => {
//   if (request.session.user) {
//     // <== if there's user in the session (user is logged in)
//     next(); // ==> go to the next route below
//   } else {
//     response.redirect("/login");
//   }
// });

// router.get("/profile", (request, response) => {
//   response.render("profile");
// });

module.exports = router;
