// User model here
const {Schema, model} = require('mongoose');

const userSchema = new Schema(
    {
        username :{
            type: String,
            trim: true,
            // Sintaxe de mensagem de erro customizada pra quando a regra do Schema não for satisfeita
            required: [true, 'Username is required.'],
            unique: true
        },

        email : {
            type : String,
            required : [true, 'Email is required'],
            unique: true,
            lowercase : true,
            trim: true
        },

        passwordHash : {
            type: String,
            required : [true, "Password is required"]
        }
    },
    {
        timestamp: true
    }
);

module.exports = model('User', userSchema);












