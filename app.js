// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');
const express = require('express'); // => Requerir express para manejar solicitudes HTTP
const logger = require('morgan'); // => Requerir Morgan para generar logs en consola
const hbs = require('hbs') // => Requerir handlebars

const app = express();

require('./config/db.config'); // => Conecta con la base de datos
app.use(logger("dev")); // => Mostrar logs



// Handlebars, vistas y archivo estáticos (no cambian)
app.set('views', `${__dirname}/views`);
app.set('view engine', 'hbs');
app.use(express.static(`${__dirname}/public`));
hbs.registerPartials(__dirname + "/views/partials");


// Acceso a la propiedad `body` de las request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const { sessionConfig, loadUser } = require('./config/session.config')
app.use(sessionConfig)
app.use(loadUser)



// Configuración rutas
const routes = require('./config/routes.config');
app.use('/', routes);



// Middleware para errores 404 (request a páginas que no existen)
app.use((req, res, next) => res.status(404).render('errors/not-found'));


app.use((err, req, res, next) => {
    // whenever you call next(err), this middleware will handle the error
    // always logs the error
    console.error("ERROR", req.method, req.path, err);

    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      res.status(500).render("errors/internal");
    }
});



// Establece el PUERTO para que nuestra app tenga acceso a él.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});


