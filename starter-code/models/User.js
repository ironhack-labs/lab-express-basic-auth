const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        username: { type: String, unique: true, index: true},//, required: true},
        password: { type: String}//, required: true}
    },
    {
        timestamps: true
    }
);

const model = mongoose.model("user", schema);

model.collection.createIndexes();

module.exports = model;