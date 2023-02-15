

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const { Schema, model } = require('mongoose');

const thingsSchema = new Schema(
  {
      username:{
          type:String,
          trim: true,
          required:true,
      },
      password:{
          type:String,
          required:true
      },
  },
  {
      timestamps:true,    
  }
);
const Thing=model('Thing',thingsSchema);
module.exports=Thing
