const mongoose=require('mongoose');
const Schema= mongoose.Schema;


const UserSchema= new Schema ({

user: String,
password: String

},{
    timestamps:true
});

const User= mongoose.model('User',UserSchema);
module.exports= User;