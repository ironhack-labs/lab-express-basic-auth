const express = require("express");

const loginCheck = () => {
    return (req, res, next) => {
    if(req.session.user) {
        next()
    } else {
        res.redirect("/");
    }
    }
};

module.exports = loginCheck;