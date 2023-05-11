//New way to require router
const { Router } = require("express");

//Require the User model
const mongoose = require("mongoose");
const User = require("../models/User.model");

const router = new Router();

//SIGN UP Route

//GET displays the signup page to the user
router.get("/signup", (req, res) => {
  res.render("auth/signup.hbs");
});

//POST retrieves the information submited by the user in the signup page
router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  //Obrigatory characteristics for password, defined by REGEX
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  //If the password doesn't pass the test
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 8 characters, 1 lowercase letter and 1 uppercase letter",
    });
    return;
  }

  // Make sure users fill all mandatory fields
  //If one of the fields is not filled
  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please add your username, password and e-mail, if you may.",
    });
    return;
  }

  //Function to encript the password
  async function encriptPassword() {
    try {
      // salt is a random string
      let salt = await bcryptjs.genSalt(saltRounds);
      // combines salt and password
      let hashedPassword = await bcryptjs.hash(password, salt);

      // save to DB
      await User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });

      // Redirect to User Profile
      res.redirect("/userProfile");
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        // HTTP Response Codes
        // 200 - successful response
        // 4xx - client-side error;
        // 404 - not found on client;
        // 5xx - server-sider error;
        // 505 - not found on server;
        // 11000 - native MongoDB error --> you tried to sumbit a value that was created before.
        // same email / same username as other user.

        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email must be unique. Choose an original username / email.",
        });
      } else {
        console.log(error);
      }
    }
  }
  encriptPassword();
});

router.get('/userProfile', isLoggedIn, (req, res)=>{
    res.render('user/userprofile.hbs', {userInSession: req.session.currentUser});
});



//LOG IN

//GET to display log in page to user
router.get("/login", (req, res) => {
  res.render("auth/login.hbs");
});

//POST validate user
router.post("/login", (req, res) => {
  console.log(req.session);
  const { email, password } = req.body;

  // Validade if the user submitted email / password blank
  if (email === "" || password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "Please fill all the required fields.",
    });
    return;
  }

  async function manageDb() {
    try {
      let user = await User.findOne({ email });
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try other.",
        });
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Wrong Password" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  manageDb();
});

module.exports = router;
