const express    = require("express");
const router = express.Router();

router.get("/main", (req, res, next) => {
    const username = req.session.currentUser.username;
    res.render("main", {username: username});
  });
  
module.exports = router;  