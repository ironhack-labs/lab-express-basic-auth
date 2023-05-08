const { Schema, model } = require("mongoose");

const operaSchema = new Schema(
    {
        image: {
            type: String,
            require: true
        },
        title: {
            type: String,
            require: true
        },
        composer: {
            type: String,
            require: true
        },
    },
    {
        timestamps: true
    }
);

const Operas = model("Operas", operaSchema);

module.exports = Operas;