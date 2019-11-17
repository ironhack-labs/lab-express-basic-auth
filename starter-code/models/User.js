const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaUser = new Schema(
    {
        name: String,
        password: String
    }
);

const Model = mongoose.model("User", schemaUser);
module.exports = Model;