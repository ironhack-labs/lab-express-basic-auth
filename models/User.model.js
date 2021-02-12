// User model here
const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required']
        }
    },
    {
        timestamps: true
    }
)

module.exports = model('User', UserSchema);

//en la exportación parece que estamos metiendo de una vez el paso
//de generación del modelo viene impllicita en la exportación.
//lo que sucede es que ahora como no está en una variable, cuando lo
//requerimos en las rutas, tendremos que darle nombre con una 
//variable, en este caso me parece la llamamos User.
//Antes hacíamos esto:
//GENERACIÓN DEL MODELO
//const Movie= model('movie', MovieSchema)
//EXPORTACIÓN
//module.exports= Movie