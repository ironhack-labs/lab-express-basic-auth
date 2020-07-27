// requiero mongoose
const mongoose = require('mongoose');
//declaro mi modelo en base a mi esquema
const Schema = mongoose.Schema;

//creo el modelo
const userSchema = new Schema(
    {
      username: String,
      password: String
    },
    {
      timestamps: true
    }
  );
  //creamos el modelo en base a userSchema y como primer parametro le pasamos el nombre el modelo

  //creo un controlador de la coleccion User(en mongo se vera users minuscula y plural) le doy instrucciones de como tiene que ser la informacion de cada objeto
  const UserModel = mongoose.model('User', userSchema);
  
  module.exports = UserModel;