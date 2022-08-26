const authRouter = require("express").Router();
const UserModel = require("../models/User.model");
const bcrypt = require("bcrypt");

authRouter.get("/register", (req, res) => {
  res.render("auth/register");
});

authRouter.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  UserModel.findOne({ $or: [{ username }, { email }] })
    .then((possibleUser) => {
      // if the user excist mongoDB gives us a user document || it return null(returns nothing)
      if (possibleUser) {
        return res.render("auth/register"); // now we know there is a user with this username
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
          res.render("user/personal", { createdUser });
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

module.exports = authRouter;
