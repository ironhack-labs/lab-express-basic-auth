1. "npm install bcrypt" para descargar el paquete de encriptación

2. models/user.model.js
   2.1. Requiero mongoose.
   2.2. En la variable Schema guardo el uso del Schema.
   2.3. En otra variable userSchema creo un nuevo Schema con usuario, password y timestamp.
   2.4. Creo un usuario con el método modelo.
   2.5. Lo exporto.

3. App.js
   3.1. Creo la ruta auth para conectar la app.
   3.2. Lo pongo encima de index porque si no crashea.

4. Routes
   4.1. Creo auth-routes.js
   4.2. Requiero express, router y el modelo USer.
   4.3. Requiero bcrypt para encriptar, con 10 rounds.
   4.4. Creo el get del signup y renderizo "auth/signup"
   4.5. Exporto el router.

5. Hbs
   4.1. Creo carpeta "auth" y meto dentro "signup.hbs"
   4.2. Creo un form dentro para rellenar user y password.

6. Compruebo el localhost.

7. Routes auth.routes.js
   7.1. Creo el router.post
   7.2. Recojo el texto de username y password
   7.3. Creo un if para comprobar si algún campo está vacío. Si hay match, renderiza signup.hbs y lanza un error.
   7.4. Busco si ya existe un usuario, redirigimos a auth/signup con un error de que ya existe.
   7.5. Si pasa esos dos ifs, encripto la password y creamos el user.
   7.6. Configuro las rounds en la variable "salt"
   7.7. Configuro la encriptación del pass con la variable "hashPass"
   7.8. Creo el usuario con el método "create" sobre el modelo "User"
