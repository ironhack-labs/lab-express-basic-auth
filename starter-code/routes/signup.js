const express = require("express");
const router = express.Router();
const UserMOdel = require("./../model/user");

// encryption of the password
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("project_folder/signup");
});

router.post("/", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  // make sure that the fields are not empty
  if (username === "" || password === "") {
    res.render("project_folder/signup", {
      errorMsg: "no username or password given"
    });
    return;
  }
  // make sure that we dont get the same username twice
  UserMOdel.findOne({ username: username })
    .then(userFound => {
      if (userFound !== null) {
        res.render("project_folder/signup", {
          errorMsg: "username taken"
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      addUser({ username: username, password: hashPass })
        .then(userAdded => {
          console.log(userAdded, " was added");
          // redirect to the login page because an accoutn was succefully created
          res.redirect("/login");
        })
        .catch(dbErr => {
          console.log(dbErr, " an error occured during adding of a user");
        });
    })
    .catch();
});

// crud functions
function addUser(data) {
  return UserMOdel.create(data);
}

module.exports = router;
