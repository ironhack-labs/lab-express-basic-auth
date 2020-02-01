const {model,Schema}=require('mongoose');

const userSchema = new Schema(
    {
     user:String,
     password:String
},
{
timestamps:true,
versionKey:false
}

)

module.exports=model('User',userSchema);