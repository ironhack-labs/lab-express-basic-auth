const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SchameName = new Schema({
    username: { type: String, unique: true },
    password: String
});

const Model = mongoose.model("Users", SchameName);
module.exports = Model;