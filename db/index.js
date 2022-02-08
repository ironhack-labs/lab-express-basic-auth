//este es el db/index

// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");

// 2. FUNCIÓN
const connectDB = async () => {

	try {
		
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})

		return console.log("Base de datos conectada.")

	} catch (error) {
		
		console.log(error)
		return process.exit(1)

	}

}

// 3. EXPORTACIÓN
module.exports = connectDB