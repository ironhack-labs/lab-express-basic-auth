const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/user");

// Iteration 1: Create a sign up form.

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const { name, username, password } = req.body;

  if (!username || !password) {
    res.render("signup", { message: "Please fill all the required fields" });
  } else {
    User.findOne({ username }).then(user => {
      if (user) {
        res.render("signup", {
          message:
            "User already exists in our database, pick a different username"
        });
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = new User({
          name: name,
          username: username,
          password: hashedPassword
        });
        newUser
          .save()
          .then(user => {
            res.redirect("success");
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  }
});

router.get("/success", (req, res, next) => {
  res.render("success");
});

//Iteration 2: Login

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render('login', { message: "Please fill all the required fields"});
  } else{
    User.findOne( {username} )
    .then(user => {
      if (user) {
        if(bcrypt.compareSync(password, user.password)) {
          res.redirect('/')
        }
      } else {
        res.redirect('/auth/login');
      }
    })
  }
});

//   if (!username || !password) {
//     res.render("login", { message: "Please fill all the required fields" });
//   } else {
//     User.findOne({ username }).then(user => {
//       if (user) {
//         res.render("signup", {
//           message:
//             "User already exists in our database, pick a different username"
//         });
//       } else {
//         const salt = bcrypt.genSaltSync(saltRounds);
//         const hashedPassword = bcrypt.hashSync(password, salt);
//         const newUser = new User({
//           name: name,
//           username: username,
//           password: hashedPassword
//         });
//         newUser
//           .save()
//           .then(user => {
//             res.redirect("success");
//           })
//           .catch(error => {
//             console.log(error);
//           });
//       }
//     });
//   }
// });
module.exports = router;