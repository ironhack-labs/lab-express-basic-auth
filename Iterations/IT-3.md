1. Crear dos rutas que solamente se puedan acceder si el user está en session

2. Creo dos views: main y private a nivel de views.

3. En index.routes.js
   3.1. Creo un middleware (puente de acceso) con un condicional que deja acceder al código de abajo si hay una sesión activa
   3.2. Creo un router.get para renderizar private.hbs
   3.3. Creo un router.get para renderizar main.hbs
