// const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// const Car = require("./models/Car");
const User = require("./models/User");

function createUser() {
    const saltRounds = 10;
    const plainPassword1 = "123";
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(plainPassword1, salt)

    User.deleteMany().then(() => {
        User.create({
            name: "Estefania",
            password: hash
        }).then(userCreated => {

            console.log("The password is correct " + bcrypt.compareSync("1234", hash))


        });
    });
}

mongoose
    .connect("mongodb://localhost/movies", {
        useNewUrlParser: true
    })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);

        createUser();
    })
    .catch(err => {
        console.error("Error connecting to mongo", err);
    });