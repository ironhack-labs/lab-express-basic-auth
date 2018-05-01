const express    = require("express");
const router = express.Router();

router.get("/private", (req, res, next) => {
    const username = req.session.currentUser.username;
    res.render("private", {username: username});
  });
  
module.exports = router;  