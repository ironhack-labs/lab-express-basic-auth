const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/firstAuth");
const User = require("./models/User");


const users = [
    {
    userName:"Charlie",
    password:"whatever"
        
    }
];


User.create(users, function(err, result){
    if(err) console.log("Nel");
    console.log("lo lograste!", result);
});

//mongoose.close();
