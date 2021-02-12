const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://copca:<pumitas12345>@cluster0.1kl7i.mongodb.net/basicAuth"
mongoose
    .connect('mongodb://localhost/express-basic-auth-dev', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch(err => console.error('Error connecting to mongo', err));