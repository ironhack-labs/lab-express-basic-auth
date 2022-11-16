const { Schema, model } = require("mongoose");

const tarotSchema = new Schema({
    name: String,
    price: Number,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

const Tarot = model("Tarot", tarotSchema)
module.exports = Tarot;
