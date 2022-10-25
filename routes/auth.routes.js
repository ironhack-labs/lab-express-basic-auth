const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

//bcrypt
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

// middleware
//auth middleware
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET ROUTE
router.get("/signup", (req, res) => res.send("SIGNUP PAGE"));

//POST ROUTE (Signup)
router.post("/signup", (req, res, next) => {
  //   console.log("The form data: ", req.body);
  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
    })
    .catch((error) => next(error));

  res.json(req.body);
});

//LOGIN
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((userFromSeach) => {
      if (!userFromSeach) {
        console.log("Invalid username or password");
        return;
      } else if (bcryptjs.compareSync(password, userFromSeach.passwordHash)) {
        console.log("creating token");
        // Deconstruct the user object to omit the password
        const { _id, username } = userFromSeach;
        // create an object that will be set as the token payload
        const payload = { _id, username };
        // create and sign the token
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        res.status(200).json({ authToken: authToken });
      } else {
        console.log("Invalid username or password");
      }
    })
    .catch((error) => next(error));
});

// Verify
router.get("/verify", (req, body, next) => {});

// rotas privadas
router.get("/main", isAuthenticated, (req, res) => res.send("MAIN PAGE"));
router.get("/private", isAuthenticated, (req, res) => res.send("PRIVATE PAGE"));

module.exports = router;
