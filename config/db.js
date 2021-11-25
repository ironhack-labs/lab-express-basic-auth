// En este archivo se genera mi conexion a mi base de datos (Mas no se pobla)


//  1. IMPORTACION DE MONGOOSE
const mongoose = require("mongoose")



// 2. GENERAR CONEXION A BASE DE DATOS 

const connectDB = async () => {
	await mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})

	console.log("Base de datos conectada")

}



// 3. EXPORTACION

module.exports = connectDB