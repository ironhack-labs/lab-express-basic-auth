const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/basic-auth");

const User = require("../models/User");

const users = [{
    userName: "sbm2391@hotmail.com",
    password: "12345"
}];

User.create(users, function(err, result){
    if(err) console.log("Nel");
    console.log("lo lograste!", result);
});