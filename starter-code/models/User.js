const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        username: { type: String, unique: true, index: true},
        password: String,
        firstName: String,
        lastName: String,
        zipCode: String
    },
    {
        timestamps: true
    }
);

const model = mongoose.model("user", schema);

model.collection.createIndexes();

module.exports = model;