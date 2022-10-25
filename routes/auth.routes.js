const { Router } = require("express");
const router = new Router();

//bcrypt
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

// GET ROUTE
router.get("/signup", (req, res) => res.send("SIGNUP PAGE"));

//POST ROUTE
router.post("/signup", (req, res, next) => {
  //   console.log("The form data: ", req.body);
  const { username, password } = req.body;
  console.log(password);

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      console.log(`password: ${password}. hashed: ${hashedPassword}`);
    })
    .catch((error) => next(error));

  res.json(req.body);
});

module.exports = router;
