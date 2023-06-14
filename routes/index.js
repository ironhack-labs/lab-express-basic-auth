
const router = require("express").Router();

/* Using Promise syntax

// GET home page 
router.get("/", (req, res, next) => {
  res.render("index");
});
*/

// Now with async await

router.get("/", async (req, res, next) => {
  try {
    res.render("index");
  } catch (error) {
    next(error);
  }
});

module.exports = router;