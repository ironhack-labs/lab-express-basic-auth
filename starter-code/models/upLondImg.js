const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const londImgSchema = new Schema({
      
    title:String,
    description: String,
    imgName: String,
    imgPath: String,
    
},{
  timestamps: { created: "createdAt", updatedAt: "updatedAt" }
})


const Img = mongoose.model('images',londImgSchema);
module.exports = Img
