1. npm install express-session connect-mongo

2. Configurar cookies y session
   2.1. Añado el Session requirements (linea 18-19)
   2.3. Añado el Middleware Setup (linea 26-38)

3. Creo login.hbs en la carpeta views/auth
   3.1. Añado un form de log-in
   3.2. Añado un link a index.hbs para ir a log-in

4. Auth.routes.js
   4.1. Creo el router.get para renderizar el hbs login.
   4.2. Creo el router post login.
   4.3. Guardo la info del form en las variables.
   4.4. Creo un condicional que, si algún campo está vacío, renderiza login.hbs y devuelve un error.
   4.5. Si pasa ese condicional, buscamos el usuario en la DB.
   4.6. Si no hay match, renderiza login y enseña un error de que no existe el user.
   4.7. Uso un condicional con el método compareSync y comparo la pass del form con la pass encriptda del DB.
   4.8. Si coincide, crea una sesión y redirige a "/"
   4.9. Si no, renderiza "/login" y muestra un error.
