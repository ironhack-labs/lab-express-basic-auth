const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/basic-auth");

const User = require("../models/User.js");

const users = [
    {
        username: "Leonardo DiCaprio",
        password: "Illinceptionyourdreams",
    },
    {
        username: "Bradley Cooper",
        password: "Imlimitless",
    },
    {
        username: "Anne Hathaway",
        password: "ThedevilwearsPrada",
    },
]

User.create(users, (err,result) => {
    if (err) {
        console.log("Error")
    } else {
    result.forEach((u) => console.log(`The user ${u} has been created successfully`));
    }
});