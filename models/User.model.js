// User model here

const { Schema, model } = require("mongoose")

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],          //Aqui decimos que el campo es requerido
            unique: true,                                   //Aqui ser campo tiene que ser unico
            lowercase: true,                                //Aqui lo pasamos a minusculas
            trim: true                                      //Aqui quitamos los espacios
        },

        passwordHash: {
            type: String, 
            required: [true, 'Password is required']        //Aqui decimos que el campo es requerido
        }
    }
)


module.exports = model('User', userSchema)                  //Aqui exportamos el modelo
