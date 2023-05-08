const { Schema, model } = require('mongoose');

const plantaSchema = new Schema(
    {
        name: { type: String },
        specie: { type: String },
        imageURL: { type: String },
    },
    {
        timestamps: true
    }
);

const Planta = model('Planta', plantaSchema);

module.exports = Planta
