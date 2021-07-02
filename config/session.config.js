const session = require("express-session");
const MongoStore = require("connect-mongo"); //paquete encargado de guardar las sesiones en la base de datos de Mongo para que sean PERSISTENTES
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/lab-express-basic-auth";

module.exports = (app) => {
    app.use(
        session({ //middleware que recibe como objetos lsa funciones de configuración
            secret: process.env.SESSION_SECRET || "súper secreto", //variable con la que se firma la cookie
            resave: true, // guarda la sesión en la BD por cada petición
            saveUninitialized: false, // sirve para no guardar las sesiones en la BD hasta que no le haya metido información, para no tener sesiones vacías
            cookie: {
                sameSite: process.env.SESSION_SAME_SITE || "lax",
                httpOnly: true, // para que la cookie vaya sólo en tráfico HTTP
                maxAge: 1000 * 60 * 60 * 24, // 1 día (tiempo que está activa la cookie y la sesión)
                secure: process.env.SESSION_SECURE || false // para hacer peticiones sólo a través de HTTPS, por defecto viene en false
            }, 
            // en store guardamos la sesión en una BD para que sea persistente
            store: MongoStore.create({
                mongoUrl: MONGO_URI,
                //ttl: 1000 * 60 * 60 * 24
            })
        })
    )
}
