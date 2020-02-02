const { model, Schema} = require ('mongoose')


const userSchema = new Schema(
    {
        user:String,
        email:String,
        password:String
    },
    {timestamps:true, versionKey: false }
)



module.exports = model("User", userSchema)