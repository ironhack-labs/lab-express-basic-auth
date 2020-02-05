const express = require('express'); 
const router = express.Router();

router.get("/main", (req, res, next) =>{
    if(res.locals.user){
        res.render("user/main", {title: res.locals.user.firstName});
    } else {
        console.log('You need to login')
        return res.redirect("/auth/login")
    }
})

router.get("/private", (req, res, next) =>{
    if (res.locals.user){
        res.render("user/private", {title: res.locals.user.firstName});
    } else {
        console.log('You need to login')
        return res.redirect("/auth/login")
    }
})

module.exports = router;