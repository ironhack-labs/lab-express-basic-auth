const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const User = new Schema({
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
});

function validateUser(userData) {
    let user = {
        username: Joi.string().max(50).required(),
        password: Joi.string().min(8).required()
    };

    let result = Joi.validate(userData, user);
    let { error } =  result;

    if(error) {
        return false;
    } else {
        return true;
    }

}

module.exports = {
    User,
    validateUser
};
