const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index");
});

  
router.get("/private", (req, res, next) => {
    if (req.session.currentUser) { 
        res.render("private"); 
    }
    else {
        res.render("auth/login", {
            errorMessage: "Please log-in first"
          });
    }
});

router.get("/main", (req, res, next) => {
    if (req.session.currentUser) { 
    res.render("main");
}  else {
    res.render("auth/login", {
        errorMessage: "Please log-in first"
      });
}
});


module.exports = router;




