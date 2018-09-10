const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        maxLength: 50,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minLength: 8
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

const User = mongoose.model("User", userSchema);

function validateUser(userData) {
    let user = {
        username: Joi.string().max(50).required(),
        password: Joi.string().min(8).required()
    };

    let result = Joi.validate(userData, user);
    let { error } =  result;

   return error;

}

module.exports = {
    User,
    validateUser
};
