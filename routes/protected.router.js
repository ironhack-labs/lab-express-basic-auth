const express = require('express');
const protectedRouter = express.Router()

protectedRouter.use((req, res, next)=>{
    console.log(req.session.currentUser)
    if(req.session.currentUser){
      next()
    }
    else{
        res.redirect('/auth/login')
    }
})

protectedRouter.get("/main", (req, res, next) => {
    res.render("protected-views/main")
})

protectedRouter.get("/private", (req, res, next) => {
    res.render("protected-views/private")
})

module.exports = protectedRouter;