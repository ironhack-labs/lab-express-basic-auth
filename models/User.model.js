// User model here

const { Schema, model } = require('mongoose');

const UserSchema = new Schema({

    username:{
        type:String,
        trim:true,
        required:[true,"Username is required"],
        unique:true

    },
    passwordHash:{
        type: String,
        required: [true,"Password is required"]
    }
},
{
  timestamps: true  
}
);


module.exports = model('User', UserSchema);
