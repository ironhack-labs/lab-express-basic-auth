const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/express-basic-auth-dev', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));


  // app.use(session({
  //     resave: true,
  //     saveUninitialized: true,
  //     secret: "basic-auth-secret",
  //     cookie: {
  //         maxAge: 60000
  //     },
  //     store: new MongoStore({
  //         mongooseConnection: mongoose.connection,
  //         ttl: 24 * 60 * 60
  //     })
  // }))


  