const mongoose = require('mongoose');



const Schema= mongoose.Schema;


const userSchema= new Schema(
  //1st argument is teh structure
    {

      userName:
      {
        type: String,
        required: [true, 'tell us username']

      },
      encyptedPassword:
      {
        type: String,
        required: [true, 'enter a password']
      },

    },
    //2nd argument --> settings object

    {
      //creates a createdAt and updateAt Date fields
      timestamps:true,
    }
  );


const UserModel= mongoose.model('User',userSchema);



module.exports=UserModel;
