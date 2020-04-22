const mongoose = require('mongoose');

mongoose
	.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
	.then((x) => {
		console.log(`Connected to Mongo! Database name: "${x.connection.name}"`);
	})
	.catch((err) => {
		console.error('Error connecting to mongo', err);
	});
