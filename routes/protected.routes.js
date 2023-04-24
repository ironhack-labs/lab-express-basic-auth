const express = require("express");
const router = express.Router();

for (let i = 0; i < 100; i++) {
  router.get(`/${i}`, (req, res, next) => {
    res.send("this is route" + i);
  });
}

module.exports = router;
