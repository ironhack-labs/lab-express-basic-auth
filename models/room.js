const { Schema, model } = require("mongoose");

const roomSchema = new Schema({
    name: String,
    price: Number,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

const Room = model("Room", roomSchema)
module.exports = Room;
