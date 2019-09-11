const mongoose = require("mongoose");
const User = require("../models/User");

mongoose.connect("mongodb://localhost/user-auth", {
    useNewUrlParser: true
});

const user = [{
        username: "Moritz",
        password: "12345678"
    },
    {
        username: "Joerg",
        password: "12345678"
    }
]

User.insertMany(user)
    .then(data => {
        console.log("Success! Added " + data.length + " user in the collection");
        mongoose.connection.close();
    })
    .catch(err => {
        console.log(err);
    });