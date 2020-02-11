const express = require("express");
const authenticationRouter = express.Router();

authenticationRouter.use((req, res, next) => {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect("/login");
    }
});

module.exports = authenticationRouter;