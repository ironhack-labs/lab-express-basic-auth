const express =  require("express");
const app = express();
const Login = require("../models/login");


// app.post("/signup", (req,res)=> {
//     console.log(req.body);
//     Movie
//         .create({
//             username: req.body.title,
//             password: req.body.director,
//         })
//         .then((movie)=> {
//             res.redirect(`/movie/detail/${movie._id}`);
//         })
//         .catch((err)=> {
//             res.send("error");
//         })
//     // res.render("createMovie");
// })


app.get('/signup', (req, res, next) => {
    res.render('signup');
  });

app.post('/signup', (req,res) =>{
    const {username,password}= req.body;
    Login
        .create({username: username, password:password})
        .then((User)=> {
            console.log("Signup Succeeded!");
        })
        .catch((err)=> {
            res.send("error");
        })
    
})

module.exports = app;