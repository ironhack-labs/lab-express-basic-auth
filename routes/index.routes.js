const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/signup', (req,res) => {
res.render("auth/signup")
})

// router.post('/signup', (req,res) => {
//     res.send(req.body)
// })

// router.get("/main", (req, res) => {
// res.render("main")
// })
    
// router.get("/private", (req, res) => {
// res.render("private", { user: req.session.currentUser })
// })

module.exports = router;
