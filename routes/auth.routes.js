const authRouter = require("express").Router();
const UserModel = require("../models/User.model");
const bcrypt = require("bcrypt");
const isLoggedIn = require("../middleware/IsLoggedIn.middleware");
const isLoggedOut = require("../middleware/isLoggedOut.middleware");

/*Register */
authRouter.get("/register", isLoggedOut, (req, res) => {
  res.render("auth/register");
});

authRouter.post("/register", isLoggedOut, (req, res) => {
  const { username, email, password } = req.body;

  UserModel.findOne({ $or: [{ username }, { email }] })
    .then((possibleUser) => {
      // if the user excist mongoDB gives us a user document || it return null(returns nothing)
      if (possibleUser) {
        // return res.render("auth/register"); // now we know there is a user with this username
        return res.render("user/personal"); // now we know there is a user with this username
      }
      const salt = bcrypt.genSaltSync(15); // destroy the password 15 times
      const hashedPassword = bcrypt.hashSync(password, salt); // hash the password

      UserModel.create({
        username,
        email,
        password: hashedPassword,
      })
        .then((createdUser) => {
          console.log("createdUser:", createdUser);
          req.session.userId = createdUser._id;
          // res.render("user/personal", { createdUser });
          res.redirect(`/user/${createdUser._id}`);
        })
        .catch((err) => {
          console.log(
            `Oopsie there went something wrong with creating your account ${err}`
          );
        });
    })
    .catch((err) => {
      console.log(
        `Oopsie there went something wrong with creating your account ${err}`
      );
      res.render("auth/register");
    });
});

/*Login */
authRouter.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

authRouter.post("/login", isLoggedOut, (req, res) => {
  const { username, password } = req.body;

  /*Validation check for login */
  if (!username) {
    return res.status(400).render("auth/login");
  }

  if (!password) {
    res.status(400).render("auth/login");
  }

  UserModel.findOne({ username })
    .then((possibleUser) => {
      if (!possibleUser) {
        return res.status(400).render("auth/login");
      } // if there is no possibleUser found in the database give the 400 error and rerender the login page

      // here we know there is a user
      const isSamePassword = bcrypt.compareSync(
        password,
        possibleUser.password
      );

      if (!isSamePassword) {
        return res.status(400).render("auth/login");
      }

      // if the user exists and the password is the same, you must be the right person
      req.session.userId = possibleUser._id;
      res.redirect(`/user/${possibleUser._id}`);
    })
    .catch((err) => {
      console.log(
        `Oopsie there went something wrong whilst reaching for a user ${err}`
      );
    });
});

/*Log out */

authRouter.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    req.clearCookie("Hello world");
    if (err) {
      return res.status(500).redirect("/");
    }
    res.redirect("/");
  });
});

module.exports = authRouter;
