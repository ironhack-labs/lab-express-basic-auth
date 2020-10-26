const express = require('express');
const router = express.Router();
const withAuth = require('../helpers/middleware')
/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


// router.use((req, res, next) => {
//     // if hay un usuario en sesión (si está logged in)
//     if (req.session.currentUser) {
//       next();
//     } else {
//       res.redirect("/login");
//     }
//   });

//   router.get("/secret", function (req, res, next) {
//     res.render("secret");
//   });
module.exports = router;
